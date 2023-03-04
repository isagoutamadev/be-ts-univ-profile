import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import helmet from 'helmet';
// import swaggerUI from 'swagger-ui-express';
import response from "@/helpers/response.helper";

class App {
    public express: express.Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorMiddleware();
        // this.initSwagger();
        this.initNotFound();
    }

    private initMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.static('public'));
        this.express.use('/api/v1/uploaded', express.static('uploaded'));
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use(`/api/v1/${controller.path}`, controller.router);
        });
    }

    // private initSwagger(): void {
    //     this.express.use('/node-swagger', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
    // }

    private initErrorMiddleware(): void {
        this.express.use(ErrorMiddleware);
    }
    
    private initNotFound() {
        this.express.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            response.notFound({}, res);
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
