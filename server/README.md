# My-Classroom-Backend
## Dependencies
- node: 16.13.0
- npm: 9.1.2
- mysql: 8.0.31

## Cloning Repo and Installing Dependencies
Install MySQL
- Refer to the [MySQL Getting Started Guide](https://dev.mysql.com/doc/mysql-getting-started/en/) for installing and troubleshooting MySQL.

Clone the GitHub Repository
```
git clone git@github.com:CS-461-nilsstreedain/classroom-polling.git
```

Navigate to the Server Directory
```
cd classroom-polling/server
```

Install the Application Dependencies
```
npm install
```

## Configuring Local Environment
Rename the .env.example file to setup environment configuration
```
mv .env.example .env
```

The server application can be configured by modifying the `/server/.env` file. The `DEV_DB_...` and `TEST_DB_...` values should match those in the database/user creation commands listed in the setup steps below. Additionally, `CLIENT_URL` should be set to the front end application URL. For basic testing, the default values can be used.

## Create and Migrate the Database
Connect to the MySQL Database using the Root User
```
mysql -u root -p
```

Create the Application Database
```
CREATE DATABASE myclassroom;
```

Create the Administrative Database User
```
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'Password_1';
```

Grant the Administrative User Access to the Application Database
```
GRANT ALL PRIVILEGES ON myclassroom.* TO 'admin'@'localhost';
```

Disconnect from the MySQL Database
```
exit
```

Migrate the Database using Sequelize
```
npx sequelize-cli db:migrate
```

## Setup Backend Testing Environment
Connect to the MySQL Database using the Root User
```
mysql -u root -p
```

Create the Test Application Database
```
CREATE DATABASE myclassroom_test;
```

Create the Testing Administrative Database User
```
CREATE USER 'testadmin'@'localhost' IDENTIFIED BY 'Password_2';
```

Grant the Testing Administrative User Access to the Test Application Database
```
GRANT ALL PRIVILEGES ON myclassroom_test.* TO 'testadmin'@'localhost';
```

Disconnect from the MySQL Database
```
exit
```

Migrate the Test Database using Sequelize
```
npx sequelize-cli db:migrate --env test
```

Seed the Test Database using Sequelize
```
npx sequelize-cli db:seed:all --env test
```

## Resetting/Rolling Back Databases
(Append `npx` commands with `--env test` to run on the test database)

Undo Database Migrations
```
npx sequelize-cli db:migrate:undo:all
```

Undo Test Database Seeding
```
npx sequelize-cli db:seed:undo:all
```

Reset Local Database
```
mysql -u root -p
```
```
DROP DATABASE myclassroom;
```
or
```
DROP DATABASE myclassroom_test;
```

## Starting the Application
```
npm run start
```

## Testing the Application
Testing the application is easy. The Jest testing framework is used to write tests for the system. A script has been added to the package.json file to run tests locally:
```
npm run test
```

If you run into issues, ensure you have done the following:
1. Created a local test database
2. Properly instantiated all env variables for the test environment

## Application Authentication & Session
The application uses cookie-based authentication once a user session has been created (i.e. a user has logged in). A user's session will have a specific XSRF token value associated with it to protect against XSRF attacks. As such, the value of that token will be sent back as a cookie, and the application expects to recieve with each authenticated request a custom X-XSRF-TOKEN header with that value, along with the traditional authentication cookie _myclassroom_session which the application generated as part of initial session creation.

A user's session is valid for a minimum of 4 hours, and as long as the user is active within 4 hours of last activity, the session can be valid for as long as 24 hours. In other words, users will be asked to login again after 4 hours of inactivity or 24 hours since they last provided their credentials.

## Configuring Services
### Emailer
The application is configured to use Courier notification infastructure to message users. In order to use the application's mailer, create an account at https://www.courier.com/. Follow Courier's setup instructions and prompts.

The process should yield a bearer token in the HTTPS request Courier generates. Copy this token, and paste it in the application environment as `COURIER_AUTH_TOKEN`. Also set `EABLE_EMAIL='true'`. That's it! You should be able to interact with the configured emailer through Courier.

It's worth noting that the application is only configured for email use through Courier, but Courier supports a variety of modern notification methods.

## Roadmap
- Learning Management System (LMS) Integration
- Expanded Question Type Support
- WebSocket Open Polling Connection for Live Updates and Feedback
- Upgrade Test Suite to Heavier Duty Framework
- Smart Classmate Pairing Suggestions
- Request Rate Limiting

## Database Schema
![Schema](https://github.com/CS-461-nilsstreedain/classroom-polling/assets/25465133/d987e780-fd0e-4ea5-bd18-c72de5d8c32c)


## Endpoints
[API Endpoints Doc](/API%20Endpoints%20MyClassroom.pdf)

## Getting Involved
Feel free to open an issue for feature requests or bugs. We openly accept pull requests for bug fixes.

## Licensing
GNU General Public License v3.0
