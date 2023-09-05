"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const coupons_1 = require("./coupons");
const client_1 = require("@prisma/client");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const express_1 = __importDefault(require("express"));
const groups_1 = require("./groups");
const listing_1 = require("./listing");
const user_1 = require("./user");
const PORT = process.env.PORT || 80;
const prisma = new client_1.PrismaClient();
const createContext = ({ req, res }) => {
    return {};
};
const t = server_1.initTRPC.context().create();
const publicProcedure = t.procedure;
const router = t.router;
const listingRoutes = (0, listing_1.ListingsRoutes)(prisma, publicProcedure);
const couponRoutes = (0, coupons_1.CouponRoutes)(prisma, publicProcedure);
const userRoutes = (0, user_1.UserRoutes)(prisma, publicProcedure);
const groupRoutes = (0, groups_1.GroupsRoutes)(prisma, publicProcedure);
const appRouter = router(Object.assign(Object.assign(Object.assign(Object.assign({}, listingRoutes), couponRoutes), userRoutes), groupRoutes));
const app = (0, express_1.default)();
app.use(express_1.default.static(__dirname + '/public'));
app.use("/trpc", trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
}));
app.get("/", (req, res) => res.send("Venture Wisconsin API"));
app.get("/privacy-policy", function (req, res) {
    res.sendFile(__dirname + "/privacy-policy.html");
});
app.get("/download-app", function (req, res) {
    res.sendFile(__dirname + "/download-app.html");
});
app.listen(PORT, () => {
    console.log(PORT);
    console.log(__dirname);
});
