import { drizzle } from "drizzle-orm/d1"
import { Hono } from 'hono'
import { googleAuth } from '@hono/oauth-providers/google'
import { users } from "./db/schema"

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.text(`${result[0].googleUserId}`)
})

app.get(
  '/google-login',
  googleAuth({
    scope: ['profile'],
  }),
  async (c) => {
    const user = c.get('user-google')
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (!user.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = drizzle(c.env.DB)
    await db.insert(users).values({
      googleUserId: user.id,
      name: user.name || '',
    });

    return c.text('Logged in')
  }
)

export default app
