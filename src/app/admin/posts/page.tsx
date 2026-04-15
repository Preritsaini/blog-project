import Link from 'next/link'
import { getAllPostsAdmin } from '@/lib/firestore/posts'
import { deletePost } from '@/actions/posts'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

export default async function AdminPostsPage() {
  const posts = await getAllPostsAdmin()

  async function handleDelete(id: string) {
    'use server'
    await deletePost(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-semibold text-[var(--color-plum-deep)]">
          Blog Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center rounded-md bg-[var(--color-plum-deep)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--color-charcoal)]/50 text-sm">No posts yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-[var(--color-lavender)]/12">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-mist)] text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Title</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Published At</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-lavender)]/8">
                {posts.map((post) => (
                  <tr key={post.id} className="bg-white hover:bg-[var(--color-mist)]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--color-charcoal)]">{post.title}</td>
                    <td className="px-4 py-3 text-[var(--color-charcoal)]/60 text-xs">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Published</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-[var(--color-lavender)] hover:underline px-2 py-1">Edit</Link>
                      <ConfirmDelete id={post.id} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium text-[var(--color-plum-deep)] text-sm leading-snug">{post.title}</p>
                  {post.published ? (
                    <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Published</span>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Draft</span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-charcoal)]/45 mb-3">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'No date'}
                </p>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs font-semibold text-[var(--color-lavender)] hover:underline">Edit</Link>
                  <ConfirmDelete id={post.id} onDelete={handleDelete} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
