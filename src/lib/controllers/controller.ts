import {HttpServer} from '../../server/httpServer'

export interface Controller {
    initialize(route: HttpServer): void;
}
