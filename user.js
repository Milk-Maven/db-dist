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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const shared_1 = require("./shared");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const consts_1 = require("./consts");
const UserRoutes = (prisma, publicProcedure) => {
    if (!publicProcedure) {
        throw Error("public Procedure not found");
    }
    const validateUserPermission = (session, expectedRole) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findFirst({
            where: { password: session },
        });
        if (user === null)
            return false;
        return user.role === expectedRole;
    });
    const create = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.createNewUserSchema.parse(payload); //validate the incoming object
        return Object.assign(Object.assign({}, parsedPayload), { email: parsedPayload.email.toLowerCase() });
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(input.password, 0);
        let role = "USER";
        if (input.email === "tylerf66@gmail.com") {
            role = "ADMIN";
        }
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign({}, input), { password: hashedPassword, role }),
        });
        return Object.assign(Object.assign({}, user), { session: user.password, role: user.role, firstName: user.firstName, lastName: user.lastName });
    }));
    const getByUnique = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.getUserSchema.parse(payload); //validate the incoming object
        return parsedName;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { email: input } });
        if (user === null) {
            throw Error("No user found");
        }
        return user;
    }));
    const getAll = publicProcedure
        .input((payload) => { })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield prisma.user.findMany();
        return users;
    }));
    const update = publicProcedure
        .input((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedPayload = shared_1.updatedUserSchema.parse(payload); //validate the incoming object
        // const hasCorrectPermissions = validateUserPermission(parsedPayload.session, USER_ROLE.ADMIN);
        // if (!hasCorrectPermissions) {
        //   throw Error("invalid permissions");
        // }
        return Object.assign(Object.assign({}, parsedPayload), { email: parsedPayload.email.toLowerCase() });
    }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const { session } = input, data = __rest(input, ["session"]);
        const user = yield prisma.user.update({
            where: { email: input.email },
            data,
        });
        return user;
    }));
    const remove = publicProcedure
        .input((payload) => {
        const parsedEmail = shared_1.deleteUserSchema.parse(payload);
        return parsedEmail.toLowerCase();
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield prisma.user.delete({ where: { email: input } });
        return res.id;
    }));
    const userLogin = publicProcedure
        .input((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const loginSchema = zod_1.z.object({
            email: zod_1.z.string().min(1),
            password: zod_1.z.string().min(8),
        });
        const parsedPayload = loginSchema.parse(payload);
        return Object.assign(Object.assign({}, parsedPayload), { email: parsedPayload.email.toLowerCase() });
    }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: input.email },
        });
        if (user === null) {
            return false;
        }
        const isCorrectLogin = yield bcrypt_1.default.compare(input.password, user.password);
        if (isCorrectLogin) {
            return {
                email: user.email,
                session: user.password,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            };
        }
        else {
            return {
                email: null,
                session: null,
                role: null,
                firstName: null,
                lastName: null,
            };
        }
    }));
    const userUnPinListing = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.pinListingSchema.parse(payload);
        return Object.assign(Object.assign({}, parsedPayload), { userEmail: parsedPayload.userEmail.toLowerCase() });
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: input.userEmail },
        });
        const listing = yield prisma.listing.findUnique({
            where: { name: input.listingName },
        });
        yield prisma.pinnedUserListing.deleteMany({
            where: { userId: user === null || user === void 0 ? void 0 : user.id, listingId: listing === null || listing === void 0 ? void 0 : listing.id },
        });
    }));
    const userPinListing = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.pinListingSchema.parse(payload);
        return Object.assign(Object.assign({}, parsedPayload), { userEmail: parsedPayload.userEmail.toLowerCase() });
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: input.userEmail },
        });
        const listing = yield prisma.listing.findUnique({
            where: { name: input.listingName },
        });
        if (listing && user) {
            const res = yield prisma.pinnedUserListing.create({
                data: { userId: user.id, listingId: listing.id },
            });
        }
        // return res.id;
    }));
    const getUserPins = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.string().email().parse(payload);
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { email: input } });
        if (user) {
            const pins = yield prisma.pinnedUserListing.findMany({
                where: { userId: user.id },
            });
            const pinnedIds = pins.map((p) => p.listingId);
            const pinnedListing = yield prisma.listing.findMany({
                where: { id: { in: pinnedIds } },
            });
            return pinnedListing;
        }
        else {
            return [];
        }
    }));
    const getUserInfo = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ email: zod_1.z.string().email() }).parse(payload);
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const userCouponsAndListings = yield Promise.all([
            prisma.listing.findMany({ where: { email: input.email } }),
            prisma.coupon.findMany({ where: { email: input.email } }),
        ]).then((res) => {
            return { coupons: res[1], listings: res[0] };
        });
        return userCouponsAndListings;
    }));
    const getUserListerRequesters = publicProcedure.mutation(() => __awaiter(void 0, void 0, void 0, function* () {
        const listings = yield prisma.listing.findMany();
        const usersWaitingToBeListers = yield prisma.user
            .findMany({
            where: {
                pendingAccountChange: true,
            },
        })
            .then((users) => {
            return users
                .filter((user) => {
                return user.role === consts_1.USER_ROLE.USER; // filter to USER role only
            })
                .map((user) => {
                const listing = listings.find((l) => {
                    return l.email === user.email;
                });
                return {
                    email: user.email,
                    listing: listing !== null && listing !== void 0 ? listing : {},
                };
            });
        });
        return usersWaitingToBeListers;
    }));
    const manageUserApprovalRequest = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ email: zod_1.z.string().email(), accepted: zod_1.z.boolean() }).parse(payload);
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.update({
            where: { email: input.email },
            data: { pendingAccountChange: false, role: input.accepted ? "LISTER" : "USER" },
        });
        if (!input.accepted) {
            yield prisma.listing.deleteMany({ where: { email: input.email } });
        }
    }));
    const userApprovalRequestPending = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ email: zod_1.z.string().email() }).parse(payload);
        return parsedPayload;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.user
            .findUnique({
            where: { email: input.email },
        })
            .then((u) => u === null || u === void 0 ? void 0 : u.pendingAccountChange);
    }));
    const userRoutes = {
        userCreate: create,
        userGetByUnique: getByUnique,
        userUpdate: update,
        userRemove: remove,
        userGetAll: getAll,
        userLogin,
        userPinListing,
        userUnPinListing,
        getUserPins,
        getUserInfo,
        getUserListerRequesters,
        manageUserApprovalRequest,
        userApprovalRequestPending,
    };
    return userRoutes;
};
exports.UserRoutes = UserRoutes;
