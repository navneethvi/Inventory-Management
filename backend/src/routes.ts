import { Router } from "express";

import getInventoryDatas from "./controller";

const router = Router()

router.get('/', getInventoryDatas)

export default router