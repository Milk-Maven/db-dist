"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 80;
// export type AppRouter = typeof appRouter;
// const prisma = new PrismaClient();
const createContext = ({ req, res }) => {
    return {};
};
// type Context = inferAsyncReturnType<typeof createContext>;
// const t = initTRPC.context<Context>().create();
// const publicProcedure = t.procedure;
// const router = t.router;
// const listingRoutes = ListingsRoutes(prisma, publicProcedure);
// const couponRoutes = CouponRoutes(prisma, publicProcedure);
// const userRoutes = UserRoutes(prisma, publicProcedure);
// const groupRoutes = GroupsRoutes(prisma, publicProcedure);
// const appRouter = router({
//   ...listingRoutes,
//   ...couponRoutes,
//   ...userRoutes,
//   ...groupRoutes,
// });
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
