import { allowedOrigins } from "./allowedOrigins.js";

export const corsOptions = {
  origin: (origin,callback) => {
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null,true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
  credentials: true
}