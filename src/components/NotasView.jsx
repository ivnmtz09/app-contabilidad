import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { StickyNote, Trash2, Plus, Pencil, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export function NotasView() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/notes`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error(t('notes.titleRequired') || 'Ingresa un título para la nota'); return; }
    if (!content.trim() || content === '<p><br></p>') { toast.error(t('notes.contentRequired') || 'Escribe algo en la nota'); return; }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/notes`, editingId), { title, content, updatedAt: new Date().toISOString() });
        toast.success(t('profile.success') || "Nota actualizada");
      } else {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/notes`), { title, content, createdAt: new Date().toISOString() });
        toast.success("Nota guardada");
      }
      resetForm();
    } catch (err) { toast.error("Error al guardar"); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (note) => {
    setEditingId(note.id); setTitle(note.title); setContent(note.content); setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => { setEditingId(null); setTitle(''); setContent(''); setShowEditor(false); };

  const handleNewNote = () => {
    resetForm();
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl text-amber-600 dark:text-amber-400"><StickyNote size={28}/></div>
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">{t('notes.title')}</h2>
          <p className="text-sm text-zinc-500">{t('notes.desc')}</p>
        </div>
      </div>

      {!showEditor ? (
        <button onClick={handleNewNote} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-5 py-4 font-semibold flex items-center justify-center gap-2 transition-colors mb-8 shadow-sm">
          <Plus size={20}/> {t('notes.add') || 'Nueva Nota'}
        </button>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
          <input type="text" placeholder={t('notes.titleInput')} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-t-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-lg text-zinc-900 dark:text-zinc-50" required />
          <div className="bg-white dark:bg-zinc-900 border-x border-b border-zinc-200 dark:border-zinc-700 rounded-b-xl overflow-hidden mb-4">
            <ReactQuill className="text-zinc-900 dark:text-zinc-50 min-h-[150px]" modules={modules} onChange={setContent} theme="snow" value={content}/>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors">{t('notes.cancel')}</button>
            <button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-2.5 font-semibold flex items-center justify-center gap-2 transition-colors">
              {editingId ? <Pencil size={18}/> : <Plus size={18}/>} {editingId ? t('notes.update') : t('notes.add')}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 && <p className="col-span-full text-center text-zinc-500 py-10">{t('notes.empty')}</p>}
        {notes.map(note => (
          <div key={note.id} onClick={() => setViewingNote(note)} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col max-h-64 cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg line-clamp-1">{note.title}</h3>
              <div className="flex gap-1 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(note); }} className="text-zinc-400 hover:text-amber-500 p-1.5 rounded-lg transition-colors"><Pencil size={18}/></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="text-zinc-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 overflow-hidden line-clamp-5 quill-content" dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        ))}
      </div>

      {viewingNote && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
              <h2 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">{viewingNote.title}</h2>
              <button onClick={() => setViewingNote(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"><X size={24}/></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar quill-content text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={() => deleteDoc(doc(db, `users/${auth.currentUser.uid}/notes`, confirmModal.id))}
        title="Eliminar nota"
        message="¿Estás seguro de que deseas eliminar esta nota?"
        confirmText="Eliminar"
      />
    </div>
  );
}
