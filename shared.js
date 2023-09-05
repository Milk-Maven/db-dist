"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.GetCouponForUserBySchema = exports.addCouponForUserByGroupSchema = exports.createGroupSchema = exports.pinListingSchema = exports.updatedUserSchema = exports.getUserSchema = exports.createNewUserSchema = exports.useCouponSchema = exports.updateCouponSchema = exports.couponIdSchema = exports.getCouponSchema = exports.createCouponSchema = exports.CouponTypes = exports.getAllCouponsSchema = exports.deleteListingSchema = exports.getAllListingsParams = exports.getListingSchema = exports.listingSchema = void 0;
const zod_1 = require("zod");
exports.listingSchema = zod_1.z.object({
    address: zod_1.z.string().min(1),
    experience1: zod_1.z.string().optional().nullable(),
    experience2: zod_1.z.string().optional().nullable(),
    experience3: zod_1.z.string().optional().nullable(),
    experience4: zod_1.z.string().optional().nullable(),
    category: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    displayTitle: zod_1.z.string().min(1),
    email: zod_1.z.string().email().min(1),
    image1: zod_1.z.string().min(1),
    image2: zod_1.z.string().min(1).optional().nullable(),
    image3: zod_1.z.string().min(1).optional().nullable(),
    image4: zod_1.z.string().min(1).optional().nullable(),
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(10),
    subTitle: zod_1.z.string().optional(),
    website: zod_1.z.string().min(1),
    zipcode: zod_1.z.string().min(5),
});
exports.getListingSchema = zod_1.z.string();
exports.getAllListingsParams = zod_1.z.object({
    name: zod_1.z.string().default(""),
    email: zod_1.z.string().default(""),
});
exports.deleteListingSchema = zod_1.z.string(); //validate the incoming object
exports.getAllCouponsSchema = zod_1.z.string().optional();
var CouponTypes;
(function (CouponTypes) {
    CouponTypes["percent"] = "% off";
    CouponTypes["offers"] = "offers";
    CouponTypes["dollar"] = "$ off";
})(CouponTypes = exports.CouponTypes || (exports.CouponTypes = {}));
exports.createCouponSchema = zod_1.z.object({
    name: zod_1.z.string(),
    listingId: zod_1.z.number().int(),
    description: zod_1.z.string(),
    email: zod_1.z.string(),
    expirationDate: zod_1.z.string(),
    groupName: zod_1.z.string().optional().nullable(),
    dollarsOff: zod_1.z.string().optional().nullable(),
    amountRequiredToQualify: zod_1.z.string().optional().nullable(),
    percentOff: zod_1.z.string().optional().nullable(),
    itemName: zod_1.z.string().optional().nullable(),
    percentOffFor: zod_1.z.string().optional().nullable(),
    couponType: zod_1.z.string(),
});
exports.getCouponSchema = zod_1.z.string();
exports.couponIdSchema = zod_1.z.object({
    id: zod_1.z.number(),
});
exports.updateCouponSchema = exports.createCouponSchema.merge(exports.couponIdSchema);
exports.useCouponSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    couponId: zod_1.z.number(),
});
exports.createNewUserSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    password: zod_1.z.string().min(8).max(16),
    email: zod_1.z.string().email(),
});
exports.getUserSchema = zod_1.z.string();
exports.updatedUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string(),
    role: zod_1.z.string(),
    session: zod_1.z.string().optional(),
});
exports.pinListingSchema = zod_1.z.object({
    listingName: zod_1.z.string(),
    userEmail: zod_1.z.string().email(),
});
exports.createGroupSchema = zod_1.z.object({
    groupName: zod_1.z.string(),
});
exports.addCouponForUserByGroupSchema = zod_1.z.object({
    userEmail: zod_1.z.string().email(),
    groupName: zod_1.z.string(),
    code: zod_1.z.string().min(6),
});
exports.GetCouponForUserBySchema = zod_1.z.object({
    userEmail: zod_1.z.string().email(),
});
exports.deleteUserSchema = zod_1.z.string(); //validate the incoming object
