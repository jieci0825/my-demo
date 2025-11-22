window.exports = {
    bookmark_manager: {
        mode: 'list',
        args: {
            enter: (action, callbackSetList) => {
                const bookmarks = getBookmarks()
                callbackSetList(
                    bookmarks.map(bookmark => ({
                        title: bookmark.title,
                        description: bookmark.url,
                        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAyMVYxNGgtNHY3bS0xIDBINnYtN0gybDEwLTlMMjIgN2gtNG0tMyAwdjYiLz48L3N2Zz4=',
                        url: bookmark.url,
                        category: bookmark.category,
                        tags: bookmark.tags
                    }))
                )
            },
            search: (action, searchWord, callbackSetList) => {
                const bookmarks = searchBookmarks(searchWord)
                callbackSetList(
                    bookmarks.map(bookmark => ({
                        title: bookmark.title,
                        description: bookmark.url,
                        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAyMVYxNGgtNHY3bS0xIDBINnYtN0gybDEwLTlMMjIgN2gtNG0tMyAwdjYiLz48L3N2Zz4=',
                        url: bookmark.url
                    }))
                )
            },
            select: (action, itemData) => {
                window.utools.hideMainWindow()
                window.utools.shellOpenExternal(itemData.url)
                window.utools.outPlugin()
            },
            placeholder: '搜索书签'
        }
    },
    search_bookmark: {
        mode: 'list',
        args: {
            enter: (action, callbackSetList) => {
                callbackSetList([])
            },
            search: (action, searchWord, callbackSetList) => {
                if (!searchWord) {
                    callbackSetList([])
                    return
                }
                const bookmarks = searchBookmarks(searchWord)
                callbackSetList(
                    bookmarks.map(bookmark => ({
                        title: bookmark.title,
                        description: bookmark.url,
                        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAyMVYxNGgtNHY3bS0xIDBINnYtN0gybDEwLTlMMjIgN2gtNG0tMyAwdjYiLz48L3N2Zz4=',
                        url: bookmark.url
                    }))
                )
            },
            select: (action, itemData) => {
                window.utools.hideMainWindow()
                window.utools.shellOpenExternal(itemData.url)
                window.utools.outPlugin()
            },
            placeholder: '输入关键词搜索书签'
        }
    }
}

// 数据存储相关
const STORAGE_KEY = 'bookmarks'

function getBookmarks() {
    const data = window.utools.dbStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

function saveBookmarks(bookmarks) {
    window.utools.dbStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

function addBookmark(bookmark) {
    const bookmarks = getBookmarks()
    bookmark.id = Date.now().toString()
    bookmark.createTime = new Date().toISOString()
    bookmarks.push(bookmark)
    saveBookmarks(bookmarks)
    return bookmark
}

function updateBookmark(id, updates) {
    const bookmarks = getBookmarks()
    const index = bookmarks.findIndex(b => b.id === id)
    if (index !== -1) {
        bookmarks[index] = {
            ...bookmarks[index],
            ...updates,
            updateTime: new Date().toISOString()
        }
        saveBookmarks(bookmarks)
        return bookmarks[index]
    }
    return null
}

function deleteBookmark(id) {
    const bookmarks = getBookmarks()
    const filtered = bookmarks.filter(b => b.id !== id)
    saveBookmarks(filtered)
    return filtered
}

function searchBookmarks(keyword) {
    const bookmarks = getBookmarks()
    if (!keyword) return bookmarks

    const lowerKeyword = keyword.toLowerCase()
    return bookmarks.filter(
        bookmark =>
            bookmark.title.toLowerCase().includes(lowerKeyword) ||
            bookmark.url.toLowerCase().includes(lowerKeyword) ||
            (bookmark.category &&
                bookmark.category.toLowerCase().includes(lowerKeyword)) ||
            (bookmark.tags &&
                bookmark.tags.some(tag =>
                    tag.toLowerCase().includes(lowerKeyword)
                ))
    )
}

// UI 交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal')
    const addBtn = document.getElementById('addBtn')
    const closeBtn = document.querySelector('.close')
    const cancelBtn = document.getElementById('cancelBtn')
    const bookmarkForm = document.getElementById('bookmarkForm')
    const searchInput = document.getElementById('searchInput')
    const bookmarkList = document.getElementById('bookmarkList')
    const importBtn = document.getElementById('importBtn')
    const exportBtn = document.getElementById('exportBtn')

    let editingBookmarkId = null

    function renderBookmarks(bookmarks = getBookmarks()) {
        if (bookmarks.length === 0) {
            bookmarkList.innerHTML =
                '<div class="empty-state">暂无书签，点击上方添加按钮开始添加</div>'
            return
        }

        bookmarkList.innerHTML = bookmarks
            .map(
                bookmark => `
      <div class="bookmark-item" data-id="${bookmark.id}">
        <div class="bookmark-content">
          <h4 class="bookmark-title">${escapeHtml(bookmark.title)}</h4>
          <a href="${escapeHtml(
              bookmark.url
          )}" class="bookmark-url" target="_blank">${escapeHtml(
                    bookmark.url
                )}</a>
          ${
              bookmark.category
                  ? `<span class="bookmark-category">${escapeHtml(
                        bookmark.category
                    )}</span>`
                  : ''
          }
          ${
              bookmark.tags && bookmark.tags.length
                  ? `
            <div class="bookmark-tags">
              ${bookmark.tags
                  .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
                  .join('')}
            </div>
          `
                  : ''
          }
        </div>
        <div class="bookmark-actions">
          <button class="btn-icon edit-btn" data-id="${
              bookmark.id
          }" title="编辑">✏️</button>
          <button class="btn-icon delete-btn" data-id="${
              bookmark.id
          }" title="删除">🗑️</button>
        </div>
      </div>
    `
            )
            .join('')

        attachEventListeners()
    }

    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.dataset.id
                const bookmark = getBookmarks().find(b => b.id === id)
                if (bookmark) {
                    editingBookmarkId = id
                    document.getElementById('modalTitle').textContent =
                        '编辑书签'
                    document.getElementById('bookmarkTitle').value =
                        bookmark.title
                    document.getElementById('bookmarkUrl').value = bookmark.url
                    document.getElementById('bookmarkCategory').value =
                        bookmark.category || ''
                    document.getElementById('bookmarkTags').value =
                        bookmark.tags ? bookmark.tags.join(', ') : ''
                    modal.style.display = 'block'
                }
            })
        })

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.dataset.id
                if (confirm('确定要删除这个书签吗？')) {
                    deleteBookmark(id)
                    renderBookmarks()
                }
            })
        })
    }

    function escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    addBtn.addEventListener('click', () => {
        editingBookmarkId = null
        document.getElementById('modalTitle').textContent = '添加书签'
        bookmarkForm.reset()
        modal.style.display = 'block'
    })

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    window.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none'
        }
    })

    bookmarkForm.addEventListener('submit', e => {
        e.preventDefault()

        const title = document.getElementById('bookmarkTitle').value.trim()
        const url = document.getElementById('bookmarkUrl').value.trim()
        const category = document
            .getElementById('bookmarkCategory')
            .value.trim()
        const tagsInput = document.getElementById('bookmarkTags').value.trim()
        const tags = tagsInput
            ? tagsInput
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag)
            : []

        if (editingBookmarkId) {
            updateBookmark(editingBookmarkId, { title, url, category, tags })
        } else {
            addBookmark({ title, url, category, tags })
        }

        modal.style.display = 'none'
        bookmarkForm.reset()
        renderBookmarks()
    })

    searchInput.addEventListener('input', e => {
        const keyword = e.target.value.trim()
        const results = searchBookmarks(keyword)
        renderBookmarks(results)
    })

    exportBtn.addEventListener('click', () => {
        const bookmarks = getBookmarks()
        const dataStr = JSON.stringify(bookmarks, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bookmarks-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    })

    importBtn.addEventListener('click', () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        input.addEventListener('change', e => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = event => {
                    try {
                        const imported = JSON.parse(event.target.result)
                        if (Array.isArray(imported)) {
                            saveBookmarks(imported)
                            renderBookmarks()
                            alert('导入成功！')
                        } else {
                            alert('文件格式错误')
                        }
                    } catch (error) {
                        alert('导入失败：' + error.message)
                    }
                }
                reader.readAsText(file)
            }
        })
        input.click()
    })

    renderBookmarks()
})
