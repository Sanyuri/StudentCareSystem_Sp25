import fs from 'node:fs'
import path from 'node:path'
import formidable, { Fields, Files, Part } from 'formidable'
import express, { Router, Request, Response, NextFunction } from 'express'
import IncomingForm from 'formidable/Formidable.js'

const router: Router = express.Router()
const uploadDir: string = path.join(process.cwd(), 'uploads')
const ALLOWED_EXTENSIONS: string[] = ['.jpg', '.jpeg', '.png']

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Đăng ký thư mục tải lên làm static

router.post('/upload', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const form: IncomingForm = formidable({
      uploadDir: uploadDir,
      keepExtensions: false,
      allowEmptyFiles: false,
      multiples: false, // Không cho phép nhiều file
      maxFileSize: 10 * 1024 * 1024, // Giới hạn file tối đa 10MB
      filter: ({ originalFilename }: Part) => {
        if (!originalFilename) return false
        const fileExtension = path.extname(originalFilename).toLowerCase()
        return ALLOWED_EXTENSIONS.includes(fileExtension) // Kiểm tra phần mở rộng
      },
    })

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' })
        return
      }

      // Lấy giá trị type từ fields
      const type: string | undefined = Array.isArray(fields.backgroundType)
        ? fields.backgroundType[0]
        : undefined

      if (!type || (type !== 'header' && type !== 'content')) {
        res.status(400).json({ error: 'Invalid type provided' })
        return
      }

      // Lấy file từ files
      const uploadedFile: formidable.File | undefined = Array.isArray(files.backgroundImage)
        ? files.backgroundImage[0]
        : undefined

      if (!uploadedFile?.filepath) {
        res.status(400).json({ error: 'No file uploaded' })
        return
      }

      // Đường dẫn file đích
      const finalFileName = `${type}.jpg` // Tên file tương ứng với type
      const finalFilePath: string = path.join(uploadDir, finalFileName)

      // Đổi tên file tạm thành tên đích
      fs.rename(uploadedFile.filepath, finalFilePath, (renameErr: NodeJS.ErrnoException | null) => {
        if (renameErr) {
          res.status(500).json({ error: 'Error saving the file' })
          return
        }

        res.status(200).json({
          success: true,
          filePath: `/uploads/${finalFileName}`,
        })
      })
    })
  } catch (error) {
    next(error)
  }
})

router.delete(
  '/remove/:type',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.params

      if (!type || (type !== 'header' && type !== 'content')) {
        res
          .status(400)
          .json({ error: 'Invalid or missing type parameter. Must be "header" or "content"' })
        return
      }

      // Xác định tên file cần xóa
      const finalFileName = `${type}.jpg`
      const finalFilePath: string = path.join(uploadDir, finalFileName)

      // Kiểm tra file có tồn tại không
      if (!fs.existsSync(finalFilePath)) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      // Xóa file
      fs.unlink(finalFilePath, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          res.status(500).json({ error: 'Error deleting the file' })
          return
        }

        res.status(200).json({
          success: true,
          message: `File ${finalFileName} deleted successfully`,
        })
      })
    } catch (error) {
      next(error)
    }
  },
)

export default router
