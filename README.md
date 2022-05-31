
[![rukundoeric](https://circleci.com/gh/rukundoeric/irembo_ZPlatform_backend.svg?style=svg)](https://app.circleci.com/pipelines/github/rukundoeric/irembo_ZPlatform_backend?branch=develop&filter=all)

# ZPlatform backend
This is a server side(backend) application for Zplatform. 

## Built With
- Node.js
- Express.js
- PostgreSQL
- Sequelize

## Getting Started
- To get a local copy up and running follow these simple steps.
  - Clone this repo: `https://github.com/rukundoeric/irembo_ZPlatform_backend.git`
  - Navigate into project directory:
  - Create file called `.env`
  - Open `.env` and initialize the following environment variables:
    ```ruby
      NODE_ENV=
      PORT=
      PRODUCTION_ORIGIN=
      DEVELOPMENT_ORIGIN=
      DEV_DATABASE_URL=
      FRONTEND_HOST=

      JWT_SECRET= # JSON WEB TOKEN SECRET WHICH WILL BE USED TO DECODE TOKENS. Here you can use a rondom string.

      EMAIL_SENDER= # Email that will be used to the emails.
      OAUTH2_USER= # user email
      OAUTH2_CLIENT_ID= # Client Id
      OAUTH2_CLIENT_SECRET= # Client secret
      OAUTH2_REDIRECT_URI= # In many cases, here you can just use this: https://developers.google.com/oauthplayground
      OAUTH2_REFRESH_TOKEN= #Refresh token 
    ```
  - Then run `npm install` or `yarn install` to install all packages.
  - If packages are installed successfully, then run `npm run db:migrate` to create all tables.
  - And the run `npm run db:seed` insert built In Users.
  - Finaly run `npm run dev` to start the server.

### Usage
  Now you can use any API development tool like [Postman](https://www.postman.com/) to test the Endpoints.

  NOTE: The server will be running on port `7890` if you din't specify it in `.env` file as mentioned above. Also, the endpoints are secured with SOP(Same origin policy).
###
#### Auth
| Endpoint                            | Methods   | Functionality             |
| ------------------------------------|-----------|---------------------------|
| /login                              | POST      | Login                     |
| /login-with-token                   | POST      | Login With Secret Toke    |
| /login-with-token/validate          | PUT       | Turn On the previous feauture  |
| /second-factor-auth                 | PUT       | Turn On 2F AUTH  |
| /second-factor-auth                 | POST      | Apply Second factor Auth  |
| /resend-one-time-password           | POST      | Resend One Time Password  |
| /resend-one-time-password           | POST      | Resend One Time Password  |
| /refresh-token                      | GET       | Refresh Token  |
| /logout                             | GET       | Logout  |

#### User
| Endpoint                            | Methods   | Functionality             |
| ------------------------------------|-----------|---------------------------|
| /signup                             | POST      | Signup                    |
| /verify-email/:token                | PUT       | Verify Email       |
| /resend-email-verification          | POST       | Resend Email Verification |
| /request-password-reset             | POST       | Request Password Reset |
| /reset-password/:token              | PUT       | Change password |
| /profile                            | GET       | Get User Profile |
| /update-profile                     | GET       | Update Profile |
| /account-verification               | POST       | Request Account Verification |
| The follow endpoints are only avairable for a moderator or Admin            |
| /get-verify-account-requests        | POST       | Get Account Verification Requests |
| /verify-account/:request_id         | POST       | Review Account Verification Requests |


### Deployment
The Appp is Hosted On Heroku

## Authors

👤 **Rukundo Eric**

- GitHub: [@githubhandle](https://github.com/rukundoeric)
- Twitter: [@twitterhandle](https://twitter.com/rukundoeric005)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/rukundo-eric-000bba181/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](issues/).

## Show your support

Give a ⭐️ if you like this project!

## 📝 License

This project is [MIT](./LICENSE) licensed.
