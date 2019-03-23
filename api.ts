import {Express, Request, Response} from "express";
import * as Nedb from "nedb";
import {join} from "path";
import sha1 from "sha1";

let db: Nedb;

type CreateUserRequest = {
    username: string;
    password: string;
}

type LoadProgressRequest = {
    user: string;
}

type SaveProgressRequest = {
    user: string;
    level: number;
    rank: number;
    attempts: number;
}

type SaveTimeRequest = {
    user: string,
    challenge: string,
    time: number
}

type CheckLoginRequest = {
    username: string;
    password: string;
}

type GetRecordsRequest = {
    user: string;
    challenge: string;
}

type GetRecordsResponse = {
    record?: {
        time: number;
        user: string;
    }
}

type UserProgressKey = {
    user: string
}

type UserProgress = UserProgressKey & {
    level: number;
    rank: number;
    attempts: number;
}

type UserDocKey = {
    username: string;
}

type UserDoc = UserDocKey & {
    hash: string | Uint8Array;
}

type UserRecordDocKey = {
    forUser: string,
    challenge: string,
}

type UserRecordDoc = UserRecordDocKey & {
    time: number;
}

const apiRoutes = {
    "/save-progress": (req: Request, res: Response) => {
        const { user, level, rank, attempts } = req.body as SaveProgressRequest;
        if (!user) {
            throw Error("user is required");
        }
        const key: UserProgressKey = { user }
        db.update(
            key,
            {
                $set: {
                    user,
                    attempts,
                },
                $max: {
                    level,
                    rank,
                },
            },
            { upsert: true },
            (_err: Error, numAffected: number, affectedDocuments: any, _upsert: boolean) => {
                res.send(JSON.stringify({numAffected}));
                res.end();
            },
        );
    },
    "/load-progress": (req, res) => {
        const { user } = req.body as LoadProgressRequest;
        const key: UserProgressKey = { user }
        db.findOne(key, (_err, doc: UserProgress) => {
            res.send(JSON.stringify(doc));
            res.end();
        });
    },
    "/save-time": (req: Request, res: Response) => {
        console.log("save time...");
        const { user, challenge, time } = req.body as SaveTimeRequest;
        const key: UserRecordDocKey = { forUser: user, challenge }
        db.update(
            key,
            { $min: { time }, $set: { forUser: user, challenge } },
            { upsert: true },
            (_err, numAffected, affectedDocuments, _upsert) => {
                res.send(JSON.stringify({numAffected}));
                res.end();
            },
        );
    },
    "/get-records": (req: Request, res: Response) => {
        const { user, challenge } = req.body as GetRecordsRequest;
        // first get this user's record (if any)
        const key: UserRecordDocKey = { forUser: user, challenge }
        db.findOne(
            key,
            (_err, doc: UserRecordDoc) => {
                const response: GetRecordsResponse = {};
                if (doc) {
                    response[user] = doc.time;
                }
                // then find the all time record
                db.find({challenge}).sort({time: 1}).limit(1).exec((_err, docs: [UserRecordDoc]) => {
                    if (docs && docs.length) {
                        response.record = {time: docs[0].time, user: docs[0].forUser};
                    }
                    res.send(JSON.stringify(response));
                    res.end();
                });
            },
        );
    },
    "/check-login": (req, res) => {
        const { username, password } = req.body as CheckLoginRequest;
        const key: UserDocKey = {username}
        db.findOne(key, (_err, doc: UserDoc) => {
            if (!doc) {
                res.send(JSON.stringify({status: "confirm", username}));
            } else {
                const hash = sha1(password + "|" + username);
                //@ts-ignore
                if (hash === doc.hash) {
                    res.send(JSON.stringify({status: "success", username: username}));
                }
                else {
                    res.send(JSON.stringify({status: "badpw", username: username}))
                }
            }
            res.end();
        });
    },
    "/create-user": (req, res) => {
        const { username, password } = req.body as CreateUserRequest;
        const hash = sha1(password + "|" + username);
        const userDoc: UserDoc = {username, hash}
        db.insert(userDoc, (err, _doc) => {
            if (!err) {
                res.send(JSON.stringify({status: "success", username}));
            } else {
                res.send(JSON.stringify({status: "error", error: err}));
            }
            res.end();
        });
    },
};

export function api(app: Express) {
    db = new Nedb({
        filename: join(__dirname, "jstouchtype.db"),
        timestampData: true,
        autoload: true,
    });

    db.loadDatabase((err) => {
        console.log("Database load:", err);
    });

    app.use("/api", function(req, res, next) {
        const handler = apiRoutes[req.path];
        if (!handler) {
            next();
        }
        try {
            handler(req, res, next);
        } catch (e) {
            console.error(e);
            res.send(JSON.stringify(e));
            res.end();
        }
    });

    //app.use('/jstouchtype/', express.static(path.join(__dirname, 'public')));
};