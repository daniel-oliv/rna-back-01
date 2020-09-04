import * as  cors from 'cors';
import * as compression from "compression";
import * as express from "express";
import {createServer, Server} from 'http'
import { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as logger from 'winston';
import { HttpServer } from './httpServer';
import { configuration } from '../../config/configuration';
import { CONTROLLERS } from '../lib/controllers/index';

export class BaseServer implements HttpServer {

    private context = 'BaseServer '

    protected app: express.Application;
    protected server: Server;

    constructor() {
        this.start();
    }

    public get(url: string, requestHandler): void {
        this.addRoute('get', url, requestHandler);
    }

    public post(url: string, requestHandler): void {
        this.addRoute('post', url, requestHandler);
    }

    public delete(url: string, requestHandler): void {
        this.addRoute('delete', url, requestHandler);
    }

    public put(url: string, requestHandler): void {
        this.addRoute('put', url, requestHandler);
    }

    private addRoute(method: 'get' | 'post' | 'put' | 'delete', url: string, requestHandler): void {
        this.app[method](url, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await requestHandler(req, res, next);
            }
            catch (e) {
              logger.error(`${this.context}[46] ${JSON.stringify(e)}`)
              logger.error(`${this.context}[46] ${req.originalUrl}`)
                res.setHeader('Content-type', 'application/json');
                res.status(400).json({ status: 'error', message: e });
            }
        });
    }

    public start() {
        logger.debug(this.context,"start")
        this.app = express();
        this.app.use(cors());
        this.app.use(compression());
        (this.app).use(bodyParser.json({ limit: '10mb', extended: true } as any))
        this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
        this.app.disable('etag');

        this.app.get('/version', (req, res) => {
            return res.json({ status: 'ok', version: 1.0 })
        })

        // this.app.use(this.checkAuth.bind(this));

        this.addControllers();

        (this.app as any).maxConnections = 100;
        this.server = createServer(this.app);

    }

    public listen(){
        return new Promise((res,rej)=>{
        const port = configuration.getConfig().project.port || 4000;

        this.server.on("error", (err)=>{
            logger.error(this.context, 'Error ao subir servidor', err.message);
            rej(err);
        })
        
        this.server.listen(port ,()=>{
            logger.info(this.context + 'Servidor porta: ' + port);
            res();
        }); 
        
    });
    }

    public acceptable(path) {
        var allow = [
            "^\/version$",
            // "^\/event$",
            // "^\/api/coap/reset-master?.*$",
            // "^\/api/file?.*$",
            // "^\/api/file/view?file=?.*$",
        ];

        var re = new RegExp(allow.join("|"), "i");
        return re.test(path);
    }

    private addControllers(): void {
        CONTROLLERS.forEach(controller => controller.initialize(this));
    }

    public getApp(){
        return this.app;
    }
}
