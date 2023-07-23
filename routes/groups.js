"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsRoutes = void 0;
const zod_1 = require("zod");
const GroupsRoutes = (prisma, publicProcedure) => {
    if (!publicProcedure) {
        throw Error("public Procedure not found");
    }
    const getAll = publicProcedure
        .input((payload) => {
        return zod_1.z.object({ email: zod_1.z.string().email() }).parse(payload);
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const userGroupNames = yield prisma.couponsForUser
            .findMany({ where: { userEmail: input.email } })
            .then((uc) => {
            return prisma.coupon.findMany({ where: { id: { in: uc.map((c) => c.couponId) } } });
        })
            .then((uc) => {
            return [...new Set(uc.map((c) => c.groupName))].filter((c) => !!c); // set removes dupes
        });
        const groupName = yield prisma.groups.findMany();
        return groupName
            .map((g) => {
            return {
                groupName: g.groupName,
                hasActivationCode: g.activationCode !== "NotRequired",
                description: g.description,
            };
        })
            .filter((g) => {
            if (!input.email)
                return true; // not filtering by what the user has
            return !userGroupNames.includes(g.groupName); // user has this package, don't send it to the drop down
        });
    }));
    return { getAllGroups: getAll };
};
exports.GroupsRoutes = GroupsRoutes;
