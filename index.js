"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const coupons_1 = require("./coupons");
const client_1 = require("@prisma/client");
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
// app.use(
//   "/trpc",
//   trpcExpress.createExpressMiddleware({
//     router: appRouter,
//     createContext,
//   })
// );
app.get("/", (req, res) => res.send("Venture Wisconsin API"));
app.listen(PORT, () => {
    console.log("listening on", PORT);
});
// export const addCouponGroups = async () => {
//   await prisma.groups.create({ data: { groupName: "Venture 2023" } });
//   await prisma.groups.create({ data: { groupName: "Brew Deck" } });
//   await prisma.groups.create({ data: { groupName: "Wine Tags" } });
// };
// export const updateCouponGroups = async () => {
//   await prisma.groups.update({
//     where: { groupName: "Wine Tags" },
//     data: { activationCode: "qwerty" },
//   });
// };
// export const getCouponUserRelation = async () => {};
// updateCouponGroups();
