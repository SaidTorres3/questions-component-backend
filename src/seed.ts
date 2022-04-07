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
        es: "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴",
        en: "How would you rate your experience in Hotel Palmeras? 🏨🌴",
        answers: [
          {
            value: 5,
            es: "Muy Buena 😀",
            en: "Awesome 😀",
          },
          {
            value: 4,
            es: "Buena 😊",
            en: "Good 😊",
          },
          {
            value: 3,
            es: "Regular 😐",
            en: "Regular 😐",
          },
          {
            value: 2,
            es: "Mala 😕",
            en: "Bad 😕",
          },
          {
            value: 1,
            es: "Muy mala 😠",
            en: "Very bad 😠",
          },
        ],
      },
    },
    context
  );
};
