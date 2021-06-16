# Exam #1: "Survey"
## Student: s286329 Lisciandrello Mattia

## React Client Application Routes

- Route `/admin`: Main page of an administrator, which contains all the surveys made by him and the option to view the submissions made for a certain survey (if there are any). The navbar is now updated and contains the link to `/insert`, along with the possibility to log out
- Route `/insert`: Page used by an administrator to insert a new survey and new open/closed questions. Contains also the Modal used to insert the questions datas.
- Route `/`: Main page of an user which is not logged in. Offers the possibility to log in and to make a submission for a certain survey.

## API Server

- GET `/api/surveys`
  - Retrieves all the surveys, even from different admins. It's used for a non-logged in user.
  - request parameters and request body content: //
  - response body content: 
    -	surveys = [{ id:, title:, adminName: }, {...}]; 
- GET `/api/surveys/admin`
  - Retrieves all the surveys for a given admin
  - request parameters and request body content: No sensible data is sent, the id of the logged user is retrieved by the back-end
  - response body content:
    - surveys = ([{ id:, title:, adminName:, n_submissions:}, {...}]); 
- GET `/api/surveys/id=:id`
  - Retrieves a survey by it's id and the questions/answers related to it
  - request parameters and request body content: id of the survey, passed as a parameter
  - response body content:
    - survey = [{
          	id:,
						question:,
						min:,
						ref_q:,
						max:,
						open:,
						required:,
						options: [{...}],
			}, {...}]; 
    -  Options is made as such: {index:, id:, id_option:, ref_q:, option_text:}

- GET `/api/answers/id=:id`
  - Retrieves all the answer sheets for a specific survey
  - request parameters and request body content: id of the survey, passed as a parameter
  - response body content:
    - answers = [{id:, ref_as:, answer_text:, ref_q:, name:, ref_s:, ref_op:},{...}]

- POST `/api/surveys`
  - Insert a survey for a given admin
  - request parameters and request body content: 
    - {title, questions: [{...}]}. 
    - A question is made as such:{
					question:,
					min:,
					max:,
					answers: [...],
					open:,
					required:,
				}; Answers contains all the possible options for a closed question.
  - response body content: A status which tells if the operation was completed correctly

- POST `/api/surveys/submit`
  - Submit a survey made by an user
  - request parameters and request body content: 
    - A json made as such: {answers:, survey:, name:,});
      - Answers = [{id_question:, answer:, open:},{...}]. If it's an answer for a closed question: [{id_question:, ref_op:, answer:, open:},{...}]
      - Survey = {id:, title:, adminName:}
      - Name contains the name of the user
  - response body content: A status which tells if the operation was completed correctly

- POST `/api/login`
  - Send the credentials in order to log in
  - request parameters and request body content: A JSON containing email and password
  - response body content: A json containing the user data

- DELETE `/api/login/current`
  - If the user is logged in, it logs him out
  - request parameters and request body content: //
  - response body content: A status which tells if the operation was completed correctly

- GET `/api/login/current`
  - Retrieves the information regarding a logged in user
  - request parameters and request body content: //
  - response body content: A json containing the user data


## Database Tables

- Table `admin` - contains id, email, name, password
- Table `survey` - contains id, ref_a, title
- Table `question` - contains id, ref_s, question, min, max, open, required
- Table `option` - contains id, ref_q, option_text
- Table `answer` - id, ref_q, answer_text, ref_as, ref_op
- Table `answer_sheet` - contains id, name, ref_s

## Main React Components

- `SurveyRow` (in `SurveyRow.js`): shows how a Survey is rendered inside a `SurveyContainer.js`. It contains also the API call to get all the info regarding a survey, which are called when the button near a certain survey is pressed (If the user is logged in, it will fetch also the answer sheets related to a certain survey. After fetching it, the response from the back-end will be processed and setted as a state).
- `ModalInsertSurvey` (in `ModalInsertSurvey.js`): contains all the states regarding a specific question and handles the insertion of a specific question. It contains both the return methods for an open and a closed question.
- `InsertSurveyRow` (in `InsertSurveyRow.js`): shows how a question is rendered inside `InsertSurvey.js`. It contains also the methods to order a question and to delete it.
- `ModalAnswerSheet` (in `ModalAnswerSheet.js`): handle the submission for a specific survey / shows the data regarding all the submissions that an admin received on one of his surveys.
- `AnswerSheetRow` (in `AnswerSheetRow.js`): renders all the questions for a specific survey and handles the state for each one of them, by managing an answer array state. 
- `API.js` (in `API.js`): contains all the API calls and the methods that communicate with the backend.
- `App.js` (in `APP.js`): handles the login/logout/checks if a user is logged in, uses API methods to get the surveys/the surveys for a specific admin and contains all the routes, while also rendering the main pages both for loggend and not-logged users.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- email: s286329@studenti.polito.it, name: Mario Rossi, password: esameMattia
- email: mattia@polito.it, name: Mattia, password: pistacchio 
