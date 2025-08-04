"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Deliveries endpoint - Coming soon!',
            data: []
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=deliveries.js.map