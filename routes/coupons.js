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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = exports.couponIsExpired = void 0;
const shared_1 = require("../shared");
const zod_1 = require("zod");
const couponIsExpired = (date) => {
    if (!date) {
        // throw Error("invalid date");
        return false;
    }
    //prisma likes to return the date as a string :(
    console.log(new Date(date).toDateString());
    console.log(new Date().getTime() > new Date(date).getTime());
    return new Date().getTime() > new Date(date).getTime();
};
exports.couponIsExpired = couponIsExpired;
const getDefaultCouponGroupName = (listingForCoupon) => {
    if (!listingForCoupon) {
        return "";
    }
    // alright so if a coupon doesn't have a group name explicitly given then assign it
    // the display title and id
    // listing can only have one default coupon
    return `${listingForCoupon === null || listingForCoupon === void 0 ? void 0 : listingForCoupon.displayTitle}`;
};
const CouponRoutes = (prisma, publicProcedure) => {
    if (!publicProcedure) {
        throw Error("public Procedure not found");
    }
    const create = publicProcedure
        .input((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedPayload = shared_1.createCouponSchema.parse(payload); //validate the incoming object
        const listingAlreadyHasCoupon = !!(yield prisma.coupon.findFirst({
            where: { listingId: parsedPayload.listingId },
        }));
        const admin = yield prisma.user
            .findUnique({
            where: { email: parsedPayload.email },
        })
            .then((user) => (user === null || user === void 0 ? void 0 : user.role) === "ADMIN");
        if (listingAlreadyHasCoupon && !admin) {
            throw Error("Listing already has coupon and User do not have admin permissions ");
        }
        return parsedPayload;
    }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const expirationDate = new Date(input.expirationDate).toISOString();
        const listingForCoupon = yield prisma.listing.findUnique({
            where: { id: input.listingId },
        });
        if (listingForCoupon === null) {
            throw Error("can't find listing");
        }
        if (!input.groupName) {
            input.groupName = getDefaultCouponGroupName(listingForCoupon);
        }
        const coupon = yield prisma.coupon.create({
            data: Object.assign(Object.assign({}, input), { expirationDate }),
        });
        // return coupon;
    }));
    const getByUnique = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.getCouponSchema.parse(payload); //validate the incoming object
        return parsedName;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield prisma.coupon.findUnique({ where: { name: input } });
        if (coupon === null) {
            throw Error("No coupon found");
        }
        return coupon;
    }));
    const getAll = publicProcedure
        .input((email) => {
        const parsedPayload = shared_1.getAllCouponsSchema.parse(email);
        return parsedPayload;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        if (input) {
            const coupons = yield prisma.coupon.findMany({
                where: { email: input },
            });
            return coupons;
        }
        else {
            const coupons = yield prisma.coupon.findMany({});
            return coupons;
        }
    }));
    const update = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.updateCouponSchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const { groupName } = input, i = __rest(input, ["groupName"]);
        const coupon = yield prisma.coupon.update({
            where: { id: input.id },
            data: Object.assign({}, input),
        });
        return coupon;
    }));
    const remove = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.couponIdSchema.parse(payload);
        return parsedName;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const removedCoupon = yield prisma.coupon.delete({
            where: { id: input.id },
        });
        yield prisma.couponsForUser.deleteMany({ where: { couponId: removedCoupon.id } });
        return removedCoupon.id;
    }));
    const couponUse = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.useCouponSchema.parse(payload);
        return parsedName;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: input.email },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) && input.email) {
            const couponExistsForUser = yield prisma.couponsForUser.findFirst({
                where: {
                    AND: {
                        couponId: input.couponId,
                        userEmail: input.email,
                    },
                },
            });
            if (!couponExistsForUser) {
                const isCouponForListing = yield prisma.coupon
                    .findUnique({
                    where: { id: input.couponId },
                })
                    .then((coupon) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    const listing = yield prisma.listing.findUnique({
                        where: { id: (_a = coupon === null || coupon === void 0 ? void 0 : coupon.listingId) !== null && _a !== void 0 ? _a : -1 },
                    });
                    return { coupon, listing };
                }))
                    .then(({ listing, coupon }) => getDefaultCouponGroupName(listing) === (coupon === null || coupon === void 0 ? void 0 : coupon.groupName));
                if (isCouponForListing) {
                    const response = yield prisma.couponsForUser.create({
                        data: { couponId: input.couponId, used: true, userEmail: input.email },
                    });
                    return response;
                }
                else {
                    throw Error("Coupon does not exist for user and coupon is not for listing");
                }
            }
            const response = yield prisma.couponsForUser.update({
                where: { id: couponExistsForUser === null || couponExistsForUser === void 0 ? void 0 : couponExistsForUser.id },
                data: { used: true },
            });
            return response;
        }
    }));
    const addCouponForUserByGroup = publicProcedure
        .input((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedPayload = shared_1.addCouponForUserByGroupSchema.parse(payload); //passed in the correct info
        const group = yield prisma.groups.findUnique({
            where: { groupName: parsedPayload.groupName },
        });
        if ((group === null || group === void 0 ? void 0 : group.activationCode) === "NotRequired" ||
            (group === null || group === void 0 ? void 0 : group.activationCode) === "Not Required" || // no code required
            (group === null || group === void 0 ? void 0 : group.activationCode) === parsedPayload.code // code required
        ) {
            return parsedPayload;
        }
        else {
            throw Error("invalid code");
        }
        //time to verify the code
    }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        // first find all of the coupons
        const coupons = yield prisma.coupon.findMany({
            where: { groupName: input.groupName },
        });
        // now grab all the existing coupons that a user has access to
        const usersExistingCouponIds = yield prisma.couponsForUser
            .findMany({
            where: { userEmail: input.userEmail },
        })
            .then((userCoupons) => userCoupons.map((c) => c.couponId));
        // we only want to add coupons the user hasn't used
        const couponsPromises = coupons
            .filter((c) => {
            return !usersExistingCouponIds.includes(c.id);
        })
            // create an array promise
            .map((c) => {
            return prisma.couponsForUser.create({
                data: {
                    couponId: c.id,
                    used: false,
                    userEmail: input.userEmail,
                },
            });
        });
        // add all coupons that the user is elidible for
        return yield Promise.all(couponsPromises);
    }));
    const hasCouponBeenUsed = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ couponId: zod_1.z.number() }).parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const coupon = yield prisma.couponsForUser.findFirst({
            where: { couponId: input.couponId },
        });
        return (_b = coupon === null || coupon === void 0 ? void 0 : coupon.used) !== null && _b !== void 0 ? _b : false;
    }));
    const getCouponsValidity = (selectedCoupon, couponsForUser, listings) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        let couponUsedState = "INVALID";
        const groupExists = yield prisma.groups
            .findUnique({ where: { groupName: (_c = selectedCoupon === null || selectedCoupon === void 0 ? void 0 : selectedCoupon.groupName) !== null && _c !== void 0 ? _c : "" } })
            .then((g) => !!g);
        const couponAvailableToUser = couponsForUser.find((c) => c.couponId === selectedCoupon.id);
        if (couponAvailableToUser === null || couponAvailableToUser === void 0 ? void 0 : couponAvailableToUser.used)
            couponUsedState = "USED";
        else if ((0, exports.couponIsExpired)(selectedCoupon === null || selectedCoupon === void 0 ? void 0 : selectedCoupon.expirationDate))
            couponUsedState = "EXPIRED";
        else if (getDefaultCouponGroupName(listings.find((l) => { var _a; return (_a = l.id === (selectedCoupon === null || selectedCoupon === void 0 ? void 0 : selectedCoupon.listingId)) !== null && _a !== void 0 ? _a : ""; })) ===
            (selectedCoupon === null || selectedCoupon === void 0 ? void 0 : selectedCoupon.groupName) ||
            groupExists) {
            couponUsedState = "VALID";
        }
        console.log(couponUsedState);
        return { couponId: selectedCoupon.id, couponUsedState };
    });
    const getUserCouponRelation = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.GetCouponForUserBySchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const couponResponse = yield prisma.couponsForUser
            .findMany({
            where: { userEmail: input.userEmail },
        })
            .then((couponsAvailableToUser) => __awaiter(void 0, void 0, void 0, function* () {
            const usersCoupons = yield prisma.coupon.findMany({
                where: { id: { in: couponsAvailableToUser.map((cIds) => cIds.couponId) } },
            });
            const listings = yield prisma.listing.findMany({
                where: { id: { in: usersCoupons.map((c) => { var _a; return (_a = c.listingId) !== null && _a !== void 0 ? _a : -1; }) } },
            });
            const couponsValidity = yield Promise.all(usersCoupons.map((c) => getCouponsValidity(c, couponsAvailableToUser, listings)));
            return { usersCoupons, couponsAvailableToUser, listings, couponsValidity };
        }));
        return couponResponse;
    }));
    const getCouponsForListing = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ listingId: zod_1.z.number(), userEmail: zod_1.z.string().email() }).parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const couponsForListing = yield prisma.coupon.findMany({ where: { listingId: input.listingId } });
        const listings = yield prisma.listing.findMany({ where: { id: input.listingId } });
        const couponsForUser = yield prisma.couponsForUser.findMany({ where: { userEmail: input.userEmail } });
        const couponAvailability = yield Promise.all(couponsForListing.map((c) => getCouponsValidity(c, couponsForUser, listings)));
        return { couponsForListing, couponAvailability };
    }));
    const getCouponsForGroup = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ groupName: zod_1.z.string().min(1) }).parse(payload);
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const couponsByGroup = yield prisma.coupon.findMany({ where: { groupName: input.groupName } });
        console.log(couponsByGroup);
        return couponsByGroup;
    }));
    const getListingForCoupon = publicProcedure
        .input((payload) => {
        const parsedPayload = zod_1.z.object({ listingId: zod_1.z.number() }).parse(payload);
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listingForCoupon = yield prisma.listing.findUnique({ where: { id: input.listingId } });
        return listingForCoupon;
    }));
    const couponRoutes = {
        couponCreate: create,
        couponGetByUnique: getByUnique,
        couponUpdate: update,
        couponRemove: remove,
        couponGetAll: getAll,
        couponUse,
        addCouponForUserByGroup,
        hasCouponBeenUsed,
        getUserCouponRelation,
        getCouponsForListing,
        getCouponsForGroup,
        getListingForCoupon,
    };
    return couponRoutes;
};
exports.CouponRoutes = CouponRoutes;
