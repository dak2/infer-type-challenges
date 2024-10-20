import { drizzle } from "drizzle-orm/d1"
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { googleAuth } from '@hono/oauth-providers/google'
import { users } from "./db/schema"
import {
  setSignedCookie,
  getSignedCookie
} from 'hono/cookie'


type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/questions', async (c) => {
  const db = drizzle(c.env.DB)
  const cookie = await getSignedCookie(c, c.env.AUTH_SECRET, 'uid')
  const userId = cookie ? parseInt(cookie, 10) : undefined;
  if (userId === undefined || isNaN(userId)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const res = await db.select().from(users).where(eq(users.id, userId))
  const user = res[0]
  const text = cookie ? `Hello ${user.name}` : 'Hello'
  return c.text(text)
})

app.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.text(`${result[0].id}`)
})

app.get(
  '/google-login',
  googleAuth({
    scope: ['profile'],
  }),
  async (c) => {
    const googleUser = c.get('user-google')
    if (!googleUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (!googleUser.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = drizzle(c.env.DB)
    const user = await db.insert(users).values({
      googleUserId: googleUser.id,
      name: googleUser.name || '',
    }).returning();

    setSignedCookie(c, 'uid', `${user[0].id}`, c.env.AUTH_SECRET, { httpOnly: true })
    return c.text('Logged in')
  }
)

export default app
