import authRoutes from "../routes/authRoutes.js"
import fileRoutes from "../routes/fileRoutes.js"

const pathArr = [
    {path: '/auth', route: authRoutes},
    {path: '/files', route: fileRoutes},
]

export default pathArr