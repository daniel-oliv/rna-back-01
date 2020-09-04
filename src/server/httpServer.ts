import * as express from "express";

export interface HttpServer {
    get(url: string, requestHandler, options?): void;

    post(url: string, requestHandler, options?): void;

    delete(url: string, requestHandler, options?): void;

    put(url: string, requestHandler, options?): void;

    getApp(): express.Application;
}
