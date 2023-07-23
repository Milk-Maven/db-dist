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
exports.ListingsRoutes = void 0;
const shared_1 = require("../shared");
const consts_1 = require("../consts");
const ListingsRoutes = (prisma, publicProcedure) => {
    if (!publicProcedure) {
        throw Error("public Procedure not found");
    }
    const create = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.listingSchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listing = yield prisma.listing
            .create({
            data: Object.assign({}, input),
        })
            .then((listing) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.user.findUnique({ where: { email: listing.email } });
            yield prisma.user.update({ where: { email: listing.email }, data: { pendingAccountChange: true } });
            return listing;
        }));
        return listing;
    }));
    const getByUnique = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.getListingSchema.parse(name); //validate the incoming object
        return parsedName;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listing = yield prisma.listing.findUnique({
            where: { name: input },
        });
        if (listing === null) {
            throw Error("No listing found");
        }
        return listing;
    }));
    const getAll = publicProcedure
        .input((payload) => {
        const res = shared_1.getAllListingsParams.parse(payload);
        return res;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listings = yield prisma.listing.findMany({
            where: { name: { startsWith: input.name }, email: { startsWith: input.email } },
        });
        return listings;
    }));
    const getAllApprovedListings = publicProcedure
        .input((payload) => {
        const res = shared_1.getAllListingsParams.parse(payload);
        return res;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listings = yield prisma.listing.findMany({
            where: { name: { startsWith: input.name }, email: { startsWith: input.email } },
        });
        const approvedListings = yield prisma.user
            .findMany({
            where: {
                AND: {
                    email: { in: listings.map((l) => l.email) },
                    NOT: { role: consts_1.USER_ROLE.USER },
                },
            },
        })
            .then((approvedUsers) => {
            return listings.filter((l) => approvedUsers.map((u) => u.email).includes(l.email));
        });
        return approvedListings;
    }));
    const update = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.listingSchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const listings = yield prisma.listing.update({
            where: { name: input.name },
            data: Object.assign({}, input),
        });
        return listings;
    }));
    const remove = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.deleteListingSchema.parse(payload);
        return parsedName;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedListing = yield prisma.listing.delete({
            where: { name: input },
        });
        const couponsAssociatedWithListing = yield prisma.coupon.findMany({ where: { listingId: deletedListing.id } });
        yield prisma.couponsForUser.deleteMany({
            where: { couponId: { in: couponsAssociatedWithListing.map((c) => c.id) } },
        });
        yield prisma.coupon.deleteMany({ where: { listingId: deletedListing.id } });
        return deletedListing;
    }));
    const listingRoutes = {
        listingCreate: create,
        listingGetByUnique: getByUnique,
        listingUpdate: update,
        listingRemove: remove,
        listingGetAll: getAll,
        getAllApprovedListings,
    };
    return listingRoutes;
};
exports.ListingsRoutes = ListingsRoutes;
