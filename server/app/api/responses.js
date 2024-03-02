const router = require("express").Router({ mergeParams: true });
const db = require("../models/index");
const { requireAuthentication } = require("../../lib/auth");
const { serializeSequelizeErrors } = require("../../lib/string_helpers");
const { UniqueConstraintError, ValidationError } = require("sequelize");
const questionService = require("../services/question_service");
const responseService = require("../services/response_service");

// student is answering a question
// Path is /courses/:course_id/lectures/:lecture_id/questions/:question_id/responses
router.post("/", requireAuthentication, async function (req, res, next) {
	const user = await db.User.findByPk(req.payload.sub); // find user by ID, which is stored in sub
	const courseId = parseInt(req.params["course_id"]);
	const lectureId = parseInt(req.params["lecture_id"]);
	const questionId = parseInt(req.params["question_id"]);
	const points = parseInt(req.params["points"]) || 0;
	const totalPoints = parseInt(req.params["total_points"]) || 0;
	// code to check if the req params are valid
	if (!user || !courseId || !lectureId || !questionId) {
		return res.status(400).send({
			error: `Invalid request parameters`,
		});
	}

	// for now, only multiple choice and multiple answer available
	try {
		const enrollmentStudent = await db.Enrollment.findOne({
			// check to make sure the user is a student for the specified course
			where: { role: "student", userId: user.id },
			include: [
				{
					model: db.Section,
					required: true,
					where: { courseId: courseId },
				},
			],
		});
		const questionInLecture = await questionService.getQuestionInLecture(
			questionId,
			lectureId
		);
		if (!enrollmentStudent)
			return res.status(403).send({
				error: `Only a student in the course can submit a response to the question`,
			});
		if (!req.body.answers || !(Object.keys(req.body.answers).length > 1))
			// request must have an answer and it must have at least two options to pick from
			return res.status(400).send({
				error: `Submission must be present and must contain at least two options`,
			});
		if (!questionInLecture)
			return res.status(404).send({
				error: `No question in lecture found for the given lecture and question`,
			});
		if (questionInLecture.published != true)
			// question is no longer available
			return res.status(400).send({ error: `The question is not published` });

		// if the question in lecture exists, we know there is a question that we can check for scoring
		const question = await questionService.getQuestionInCourse(
			questionId,
			courseId
		);
		const questionScore = questionService.getQuestionScore(question, req.body);
		const responseToInsert = {
			enrollmentId: enrollmentStudent.id,
			questionInLectureId: questionInLecture.id,
			score: questionScore,
			submission: req.body.answers,
		};

		// code to verify points and totalPoints are valid
		if (points && totalPoints) {
			responseToInsert.points = points;
			responseToInsert.totalPoints = totalPoints;
		}

		const response = await db.Response.create(
			responseService.extractResponseInsertFields(responseToInsert)
		);
		res.status(201).send({
			response: responseService.extractResponseFields(response),
		});
	} catch (e) {
		next(e);
	}
});

// this route isn't even implemented in the frontend
// student is resubmitting their answer to a question
// Path is /courses/:course_id/lectures/:lecture_id/questions/:question_id/responses/:response_id
router.put(
	"/:response_id",
	requireAuthentication,
	async function (req, res, next) {
		const user = await db.User.findByPk(req.payload.sub); // find user by ID, which is stored in sub
		const responseId = parseInt(req.params["response_id"]);
		const courseId = parseInt(req.params["course_id"]);
		const lectureId = parseInt(req.params["lecture_id"]);
		const questionId = parseInt(req.params["question_id"]);
		if (!user) {
			return res.status(403).send({
				error: `Only a student in the course can submit a response to the question`,
			});
		}
		// validate request parameters
		if (!responseId || !courseId || !lectureId || !questionId) {
			return res.status(400).send({
				error: `Invalid request parameters`,
			});
		}

		// check to make sure the user is a student for the specified course
		const enrollmentStudent = await db.Enrollment.findOne({
			where: { role: "student", userId: user.id },
			include: [
				{
					model: db.Section,
					required: true,
					where: { courseId: courseId },
				},
			],
		});

		// check to make sure response exists and belongs to the user making the request
		// this is timing out because it's not finding the response
		// rewrite the query to set a timeout if a response is not found
		console.log(`responseId: ${responseId} user.id: ${user.id}`);
		// write a query to find the response
		const oldResponse = await db.Response.findByPk(responseId);
		// SELECT * FROM Responses WHERE id = ${responseId} AND Enrollment.userId = ${user.id}, { model: db.Response };

		if (enrollmentStudent) {
			// for now, only multiple choice and multiple answer available
			if (req.body.answers && Object.keys(req.body.answers).length > 1) {
				// request must have an answer and it must have at least two options to pick from
				//const oldResponse = await db.Response.findByPk(responseId)
				if (oldResponse) {
					try {
						const questionInLecture =
							await questionService.getQuestionInLecture(questionId, lectureId);
						if (questionInLecture) {
							// if we found a valid questionInLecture
							if (questionInLecture.published === true) {
								// if the question in lecture exists, we know there is a question that we can check for scoring
								const question = await questionService.getQuestionInCourse(
									questionId,
									courseId
								);
								const questionScore = questionService.getQuestionScore(
									question,
									req.body
								);
								const responseToUpdate = {
									score: questionScore,
									submission: req.body.answers,
								};
								const response = await oldResponse.update(responseToUpdate);
								res.status(200).send({
									response: responseService.extractResponseFields(response),
								});
							} else {
								// question is no longer available
								res
									.status(400)
									.send({ error: `The question is not published` });
							}
						} else {
							res.status(404).send({
								error: `No question in lecture found for the given lecture and question`,
							});
						}
					} catch (e) {
						next(e);
					}
				} else {
					// maybe better to have a different status code if it belongs to another user
					// the thought here is that if it does belong to another user it would be better to not explicitly tell an attacker that
					res.status(404).send({ error: "response with given id not found" });
				}
			} else {
				res.status(400).send({
					error: `Submission must be present and must contain at least two options`,
				});
			}
		} else {
			res.status(403).send({
				error: `Only a student in the course can submit a response to the question`,
			});
		}
	}
);

module.exports = router;
