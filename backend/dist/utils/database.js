"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
let prisma;
if (process.env.NODE_ENV === 'production') {
    exports.prisma = prisma = new client_1.PrismaClient();
}
else {
    if (!global.__prisma) {
        global.__prisma = new client_1.PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    exports.prisma = prisma = global.__prisma;
}
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await prisma.$disconnect();
        console.log('Database disconnected successfully');
    }
    catch (error) {
        console.error('Database disconnection failed:', error);
        throw error;
    }
}
exports.default = prisma;
//# sourceMappingURL=database.js.map