import "dotenv/config";
import "module-alias/register";

import App from "./app";
import { AuthController } from "./resources/auth/auth.controller";
import { MajorController } from "./resources/major/major.controller";
import { StudentController } from "./resources/student/student.controller";
import { TagController } from "./resources/tag/tag.controller";
import { UploadController } from "./resources/upload/upload.controller";
import { UserController } from "./resources/user/user.controller";
import { CreationController } from "./resources/creation/creation.controller";
import { FaqsController } from "./resources/faqs/faqs.controller";

const app = new App([
    new AuthController(),
    new UserController(),
    new UploadController(),
    new StudentController(),
    new TagController(),
    new MajorController(),
    new CreationController(),
    new FaqsController(),
], Number(process.env.PORT || 8000));

app.listen();