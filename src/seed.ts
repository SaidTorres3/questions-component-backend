import { Context } from "./index";
import { CreateQuestionMutation } from "./resolvers/mutations/createQuestion";
import { CreateUserMutation } from "./resolvers/mutations/createUser";
import { UserType } from "./entities/user";

export const Seed = async (context: Context) => {
  // use context.connection.manager.save(...) to generate an admin and then log in.
  const user_creator = new CreateUserMutation();

  await user_creator.createUser(
    {
      input: {
        username: "poller",
        password: "poller",
        type: UserType.pollster,
      },
    },
    context
  );

  const question_creator = new CreateQuestionMutation();
  await question_creator.createQuestion(
    {
      input: {
        imgUrl:
          "https://images.trvl-media.com/hotels/54000000/53720000/53714500/53714404/1316f078_z.jpg",
        es: "ΒΏCΓ³mo calificarΓ­a su experiencia en Hotel Palmeras? π¨π΄",
        en: "How would you rate your experience in Hotel Palmeras? π¨π΄",
        answers: [
          {
            value: 5,
            es: "Muy Buena π",
            en: "Awesome π",
          },
          {
            value: 4,
            es: "Buena π",
            en: "Good π",
          },
          {
            value: 3,
            es: "Regular π",
            en: "Regular π",
          },
          {
            value: 2,
            es: "Mala π",
            en: "Bad π",
          },
          {
            value: 1,
            es: "Muy mala π ",
            en: "Very bad π ",
          },
        ],
      },
    },
    context
  );
};
