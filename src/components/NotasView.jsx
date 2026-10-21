import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { StickyNote, Trash2, Plus, Pencil, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import { NotasSkeleton } from './Loaders';

export function NotasView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [isLoaded, setIsLoaded] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  useEffect(() => {
    // Guard: esperar a que el usuario esté resuelto
    if (!user) {
      setNotes([]);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/notes`), orderBy('createdAt', 'desc'));
    const unsubNotes = onSnapshot(
      q,
      (snap) => {
        setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar notas:", error);
        toast.error("Error de permisos o conexión al cargar notas");
        setIsLoaded(true);
      }
    );

    return () => {
      unsubNotes();
    };
  }, [user]);

  useEffect(() => {
    if (!viewingNote) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setViewingNote(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingNote]);

  if (!isLoaded) return <NotasSkeleton />;


  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para guardar notas");
      return;
    }
    if (!title.trim()) { toast.error(t('notes.titleRequired') || 'Ingresa un título para la nota'); return; }
    if (!content.trim() || content === '<p><br></p>') { toast.error(t('notes.contentRequired') || 'Escribe algo en la nota'); return; }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, `users/${user.uid}/notes`, editingId), { title: title.trim(), content, updatedAt: new Date().toISOString() });
        toast.success(t('profile.success') || "Nota actualizada");
      } else {
        await addDoc(collection(db, `users/${user.uid}/notes`), { title: title.trim(), content, createdAt: new Date().toISOString() });
        toast.success("Nota guardada");
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar nota:", err);
      toast.error("Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user || !confirmModal.id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/notes`, confirmModal.id));
      toast.success("Nota eliminada");
    } catch (err) {
      console.error("Error al eliminar nota:", err);
      toast.error("Error al eliminar la nota");
    }
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
            <button type="button" onClick={resetForm} className="px-5 py-2.5 min-h-[44px] rounded-xl font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer">{t('notes.cancel')}</button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-2.5 min-h-[44px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
            >
              {editingId ? <Pencil size={18}/> : <Plus size={18}/>}
              {isSubmitting ? (editingId ? "Actualizando…" : "Guardando…") : (editingId ? t('notes.update') : t('notes.add'))}
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
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleEdit(note); }}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-amber-500 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Editar nota"
                  aria-label={`Editar nota ${note.title}`}
                >
                  <Pencil size={18}/>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Eliminar nota"
                  aria-label={`Eliminar nota ${note.title}`}
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 overflow-hidden line-clamp-5 quill-content" dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        ))}
      </div>

      {viewingNote && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setViewingNote(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-note-title"
        >
          <div
            className="w-full max-w-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
              <h2 id="view-note-title" className="font-bold text-xl text-zinc-900 dark:text-zinc-50">{viewingNote.title}</h2>
              <button
                type="button"
                onClick={() => setViewingNote(null)}
                aria-label="Cerrar modal"
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20}/>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar quill-content text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: viewingNote.content }} />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar nota"
        message="¿Estás seguro de que deseas eliminar esta nota?"
        confirmText="Eliminar"
      />
    </div>
  );
}
