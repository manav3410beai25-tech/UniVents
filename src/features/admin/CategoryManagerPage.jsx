import React, { useState } from 'react';
import { Plus, Tags, CheckCircle2, XCircle, Edit2, AlertCircle } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { categoryService } from '../../services/categoryService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function CategoryManagerPage() {
  const { categories, refreshAll, events } = useEvents();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        categoryService.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: (slug || name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        });
        toast.success('Category updated successfully.');
      } else {
        categoryService.createCategory({
          name: name.trim(),
          slug: slug.trim(),
        });
        toast.success('New category created.');
      }
      refreshAll();
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleToggleStatus = (cat) => {
    try {
      const updated = categoryService.toggleCategoryStatus(cat.id);
      refreshAll();
      toast.info(`Category "${cat.name}" is now ${updated.isActive ? 'Active' : 'Deactivated'}.`);
    } catch (err) {
      toast.error('Failed to change category status.');
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 860 }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Category Management</h1>
          <p className="text-secondary text-sm">
            Configure campus event tags, discovery categories, and assignability rules.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Add Category
        </Button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Category Name</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Slug</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Associated Events</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const eventCount = events.filter((e) => e.categoryId === cat.id).length;

              return (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {cat.slug}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-neutral">{eventCount} events</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {cat.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-neutral">Deactivated</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(cat)}>
                        Edit
                      </Button>
                      <Button
                        variant={cat.isActive ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleStatus(cat)}
                      >
                        {cat.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Create New Category'}
          maxWidth={460}
        >
          <form onSubmit={handleSave}>
            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error-text)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="Category Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                }
              }}
              placeholder="e.g. Entrepreneurship"
              required
            />

            <Input
              label="URL Slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. entrepreneurship"
              required
            />

            <div className="flex justify-end gap-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Category
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
