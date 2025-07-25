# Инструкция по запуску Docker-контейнеров для проекта

## 1. Подготовка

- Убедитесь, что у вас есть файлы `package.json` и `package-lock.json` в корне проекта.
- Папка `node_modules` не требуется для сборки контейнеров и может быть удалена.
- В файле `.dockerignore` должна быть строка:
  ```
  node_modules
  ```
- Не должно быть volume-монтажа кода в docker-compose.yml (не используйте `volumes: - .:/app`).

## 2. Сборка контейнеров

Выполните в терминале:

```bash
cd Replit-test
npm install # только если хотите работать локально, для Docker не обязательно
# Далее все команды из папки, где лежит docker-compose.yml

docker-compose build --no-cache
```

## 3. Запуск контейнеров

```bash
docker-compose up
```

- Frontend будет доступен на http://localhost:3000
- Backend (API) — на http://localhost:3001 (если реализован)

## 4. Типичные ошибки и их решения

- **express/vite/tsx не найден:**
  - Убедитесь, что они есть в `package.json` (в dependencies или devDependencies).
  - В Dockerfile используйте просто `RUN npm install`, не добавляйте `--omit=dev`.
- **esbuild platform error:**
  - Не копируйте локальный `node_modules` в контейнер, не используйте volume.
- **Приложение не открывается:**
  - Проверьте, что сервер слушает порт 0.0.0.0:3000 (или нужный порт), а не только localhost.
  - Проверьте логи контейнеров: `docker-compose logs frontend` и `docker-compose logs backend`.

## 5. Восстановление зависимостей локально (если нужно)

```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Эта инструкция гарантирует корректный запуск контейнеров на любой машине с Docker.** 