<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h6">DE 訂單檔案管理</h1>
      </v-col>
    </v-row>

    <!-- 訂單匯出區域 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>file_download</v-icon>
            匯出訂單至 Excel
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="orderNumbers"
              label="請輸入訂單編號，用逗號隔開"
              placeholder="例如：475956,475959"
              rows="3"
              outlined
              :loading="exporting"
            />
            <v-btn
              color="primary"
              :disabled="!orderNumbers.trim() || exporting"
              :loading="exporting"
              @click="exportOrdersToExcel"
            >
              <v-icon left>file_download</v-icon>
              匯出 Excel
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="mb-2">
          <v-card-title>
            <v-icon left>cloud_upload</v-icon>
            上傳訂單檔案
          </v-card-title>
          <v-card-text>
            <v-file-input
              v-model="uploadFile"
              label="選擇要上傳的檔案"
              :loading="uploading"
              @change="handleFileSelect"
            />
            <v-btn
              color="primary"
              :disabled="!uploadFile || uploading"
              :loading="uploading"
              @click="uploadOrderFile"
            >
              <v-icon left>cloud_upload</v-icon>
              上傳檔案
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 頁籤切換 -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary">
          <v-tab>
            <v-icon left>folder</v-icon>
            訂單檔案 (Order)
          </v-tab>
          <v-tab>
            <v-icon left>check_circle</v-icon>
            確認檔案 (Confirm)
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- 檔案清單 -->
    <v-row>
      <v-col cols="12">
        <v-tabs-items v-model="activeTab">
          <!-- 訂單檔案頁籤 -->
          <v-tab-item>
            <v-card>
              <v-card-title>
                <v-icon left>folder_open</v-icon>
                訂單檔案清單 (/order/inbox)
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :loading="loadingOrderFiles"
                  depressed
                  @click="fetchOrderFiles"
                >
                  <v-icon left>refresh</v-icon>
                  重新整理
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="fileHeaders"
                  :items="orderFiles"
                  :loading="loadingOrderFiles"
                  loading-text="載入檔案清單中..."
                  no-data-text="沒有找到檔案"
                  class="elevation-1"
                >
                  <template slot="item.actions" slot-scope="{ item }">
                    <v-btn
                      depressed
                      small
                      :loading="downloadingFiles[item.fileName]"
                      @click="downloadFile(item.fileName, 'order')"
                      class="mr-2"
                    >
                      <v-icon small left>cloud_download</v-icon>
                      下載
                    </v-btn>
                    <v-btn
                      depressed
                      small
                      color="error"
                      :loading="deletingFiles[item.fileName]"
                      @click="confirmDeleteFile(item.fileName)"
                    >
                      <v-icon small left>delete</v-icon>
                      刪除
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- 確認檔案頁籤 -->
          <v-tab-item>
            <v-card>
              <v-card-title>
                <v-icon left>check_circle_outline</v-icon>
                確認檔案清單 (/CONFIRM_DE/inbox)
                <v-spacer></v-spacer>
                <v-btn
                  depressed
                  color="primary"
                  :loading="loadingConfirmFiles"
                  @click="fetchConfirmFiles"
                >
                  <v-icon left>refresh</v-icon>
                  重新整理
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="fileHeaders"
                  :items="confirmFiles"
                  :loading="loadingConfirmFiles"
                  loading-text="載入檔案清單中..."
                  no-data-text="沒有找到檔案"
                  class="elevation-1"
                >
                  <template slot="item.actions" slot-scope="{ item }">
                    <v-btn
                      small
                      depressed
                      :loading="downloadingFiles[item.fileName]"
                      @click="downloadFile(item.fileName, 'confirm')"
                    >
                      <v-icon small left>cloud_download</v-icon>
                      下載
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>

    <!-- 刪除確認對話框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">warning</v-icon>
          確認刪除
        </v-card-title>
        <v-card-text>
          確定要刪除檔案 <strong>{{ fileToDelete }}</strong> 嗎？
          <br />
          此操作無法復原。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">取消</v-btn>
          <v-btn color="error" text @click="deleteFile">確認刪除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { apiAxios } from '@/api'
import axios from 'axios'

export default {
  name: 'DeOrderFiles',
  data() {
    return {
      activeTab: 0,
      uploadFile: null,
      uploading: false,
      orderNumbers: '',
      exporting: false,
      loadingOrderFiles: false,
      loadingConfirmFiles: false,
      orderFiles: [],
      confirmFiles: [],
      downloadingFiles: {},
      deletingFiles: {},
      deleteDialog: false,
      fileToDelete: '',
      fileHeaders: [
        {
          text: '檔案名稱',
          value: 'fileName',
          sortable: true,
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false,
          width: '200px',
        },
      ],
    }
  },
  created() {
    this.fetchOrderFiles()
    this.fetchConfirmFiles()
  },
  methods: {
    // 處理檔案選擇
    handleFileSelect(file) {
      this.uploadFile = file
    },

    // 匯出訂單至 Excel
    async exportOrdersToExcel() {
      if (!this.orderNumbers.trim()) {
        this.$snackbar.add('請輸入訂單編號')
        return
      }

      this.exporting = true
      try {
        // 處理訂單編號（移除空白並分割）
        const orderNumberList = this.orderNumbers
          .split(',')
          .map(num => num.trim())
          .filter(num => num !== '')

        if (orderNumberList.length === 0) {
          this.$snackbar.add('請輸入有效的訂單編號')
          return
        }

        // 使用 axios 直接實例來處理檔案下載
        const accessToken = localStorage.getItem('pec_access_token')
        const baseURL =
          location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : import.meta.env.VITE_ROOT_API

        console.log(baseURL)

        const response = await axios({
          method: 'POST',
          url: `${baseURL}/DeOrder/ExportOrdersToExcel`,
          data: orderNumberList,
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        // 建立下載連結
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        let fileName = `${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '')}_01.xlsx`

        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.$snackbar.add('Excel 匯出成功', { color: 'success' })
        this.orderNumbers = '' // 清空輸入欄位
      } catch (error) {
        console.error('Export error:', error)
        if (error.response && error.response.status === 403) {
          this.$snackbar.add('沒有權限匯出訂單')
        } else if (error.response && error.response.status === 400) {
          this.$snackbar.add('訂單編號格式錯誤或不存在')
        } else {
          this.$snackbar.add('匯出過程中發生錯誤')
        }
      } finally {
        this.exporting = false
      }
    },

    // 上傳訂單檔案
    async uploadOrderFile() {
      if (!this.uploadFile) {
        this.$snackbar.add('請先選擇要上傳的檔案')
        return
      }

      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('file', this.uploadFile)

        await apiAxios({
          method: 'POST',
          url: '/DeOrder/UploadOrder',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.$snackbar.add('檔案上傳成功', { color: 'success' })
        // 重新載入訂單檔案清單
        await this.fetchOrderFiles()
      } catch (error) {
        console.error('Upload error:', error)
        this.$snackbar.add('上傳過程中發生錯誤')
      } finally {
        this.uploading = false
      }
    },

    // 取得訂單檔案清單
    async fetchOrderFiles() {
      this.loadingOrderFiles = true
      try {
        const response = await apiAxios({
          method: 'GET',
          url: '/DeOrder/GetFiles?pathType=order',
        })
        console.log(response)

        if (response.status === 1) {
          this.orderFiles = response.result.map(fileName => ({
            fileName,
          }))
        } else {
          this.$snackbar.add(response.message || '取得檔案清單失敗')
        }
      } catch (error) {
        console.error('Fetch order files error:', error)
        this.$snackbar.add('取得檔案清單時發生錯誤')
      } finally {
        this.loadingOrderFiles = false
      }
    },

    // 取得確認檔案清單
    async fetchConfirmFiles() {
      this.loadingConfirmFiles = true
      try {
        const response = await apiAxios({
          method: 'GET',
          url: '/DeOrder/GetFiles?pathType=confirm',
        })

        if (response.status === 1) {
          this.confirmFiles = response.result.map(fileName => ({
            fileName,
          }))
        } else {
          this.$snackbar.add(response.message || '取得檔案清單失敗')
        }
      } catch (error) {
        console.error('Fetch confirm files error:', error)
        this.$snackbar.add('取得檔案清單時發生錯誤')
      } finally {
        this.loadingConfirmFiles = false
      }
    },

    // 下載檔案
    async downloadFile(fileName, pathType) {
      this.$set(this.downloadingFiles, fileName, true)
      try {
        // 使用 axios 直接實例來避免攔截器的 response.data 處理
        const accessToken = localStorage.getItem('pec_access_token')
        const baseURL =
          location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : import.meta.env.VITE_ROOT_API

        const response = await axios({
          method: 'GET',
          url: `${baseURL}/DeOrder/DownloadFile`,
          params: {
            fileName: fileName,
            pathType: pathType,
          },
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // 建立下載連結
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.$snackbar.add('檔案下載成功', { color: 'success' })
      } catch (error) {
        console.error('Download error:', error)
        if (error.response && error.response.status === 403) {
          this.$snackbar.add('沒有權限下載此檔案')
        } else {
          this.$snackbar.add('下載檔案時發生錯誤')
        }
      } finally {
        this.$set(this.downloadingFiles, fileName, false)
      }
    },

    // 確認刪除檔案
    confirmDeleteFile(fileName) {
      this.fileToDelete = fileName
      this.deleteDialog = true
    },

    // 刪除檔案
    async deleteFile() {
      if (!this.fileToDelete) {
        return
      }

      const fileName = this.fileToDelete
      this.$set(this.deletingFiles, fileName, true)
      this.deleteDialog = false

      try {
        const baseURL =
          location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : import.meta.env.VITE_ROOT_API
        const response = await apiAxios({
          method: 'DELETE',
          url: `${baseURL}/DeOrder/DeleteFile`,
          params: {
            fileName: fileName,
          },
        })

        if (response.status === 1) {
          this.$snackbar.add('檔案刪除成功', { color: 'success' })
          // 重新載入訂單檔案清單
          await this.fetchOrderFiles()
        } else {
          this.$snackbar.add(response.message || '刪除失敗')
        }
      } catch (error) {
        this.$snackbar.add('刪除檔案時發生錯誤')
      } finally {
        this.$set(this.deletingFiles, fileName, false)
        this.fileToDelete = ''
      }
    },
  },
}
</script>

<style scoped>
.v-tab {
  text-transform: none;
}
</style>
