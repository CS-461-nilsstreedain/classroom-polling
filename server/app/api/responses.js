const router = require("express").Router({ mergeParams: true });
const db = require("../models/index");
const { requireAuthentication } = require("../../lib/auth");
const { serializeSequelizeErrors } = require("../../lib/string_helpers");
const { UniqueConstraintError, ValidationError } = require("sequelize");
const questionService = require("../services/question_service");
const responseService = require("../services/response_service");

// student is answering a question
router.post("/", requireAuthentication, async function (req, res, next) {
	const user = await db.User.findByPk(req.payload.sub); // find user by ID, which is stored in sub
	const courseId = parseInt(req.params["course_id"]);
	const lectureId = parseInt(req.params["lecture_id"]);
	const questionId = parseInt(req.params["question_id"]);
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
	if (!enrollmentStudent)
		return res.status(403).send({
			error: `Only a student in the course can submit a response to the question`,
		});
	if (!req.body.answers || !(Object.keys(req.body.answers).length > 1))
		// request must have an answer and it must have at least two options to pick from
		return res.status(400).send({
			error: `Submission must be present and must contain at least two options`,
		});

	// for now, only multiple choice and multiple answer available
	try {
		const questionInLecture = await questionService.getQuestionInLecture(
			questionId,
			lectureId
		);
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

// student is resubmitting their answer to a question
router.put(
	"/:response_id",
	requireAuthentication,
	async function (req, res, next) {
		const user = await db.User.findByPk(req.payload.sub); // find user by ID, which is stored in sub
		const responseId = parseInt(req.params["response_id"]);
		const courseId = parseInt(req.params["course_id"]);
		const lectureId = parseInt(req.params["lecture_id"]);
		const questionId = parseInt(req.params["question_id"]);
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
		const oldResponse = await db.Response.findOne({
			where: { id: responseId },
			include: [
				{
					model: db.Enrollment,
					required: true,
					where: { userId: user.id },
				},
			],
		});

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
