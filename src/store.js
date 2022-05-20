import m from 'mithril';
import merge from 'mergerino';
import { store } from 'vyce';
import { generateId } from './util';
import { storage } from './storage';
import { defaults } from './defaults';
import * as effect from './effects';

const MIN_DIMENSION = 200;
const DEFAULT_OPTIONS = {
    color: '#2a2a2a',
    bgColor: '#dadada',
    fontFamily: 'monospace',
    customCss: ''
};

export const NewtStore = store({
    isLoaded: false,
    autohideMenu: false,
    showOptions: false,
    showAbout: false,
    editMode: true,
    options: { ...DEFAULT_OPTIONS },
    editing: {},
    ctxMenu: {
        mode: '',
        props: null,
        x: -999,
        y: -999
    },
    boxes: [],
    boxMap: {},
    boxStackOrder: [],
    files: {},
    scroll: {
        x: 0,
        y: 0,
        lock: true
    }
});

export const actions = {
    setState: (patch) => {
        NewtStore.set((prev) => merge(prev, patch));
    },

    setEditMode: (editMode) => {
        actions.setState({
            editMode,
            editing: (prev) => !editMode ? ({}) : prev
        });
    },

    setScroll: (scroll) => {
        actions.setState({ scroll });
        actions.saveToStorage();
        effect.setHtmlOverflow(scroll.lock);
    },

    setShowOptions: (showOptions) => {
        const { scroll } = NewtStore.get();
        actions.setState({ showOptions });
        effect.setHtmlOverflow(showOptions || scroll.lock);
    },

    setBoxContent: (boxId, content) => {
        NewtStore.set((prev) => {
            prev.boxMap[boxId].content = content;
            prev.boxes = Object.values(prev.boxMap);
            return prev;
        });

        actions.saveToStorage();
    },

    setLocalFile: (id, file) => {
        actions.setState({
            files: { [id]: file }
        });
    },

    removeLocalFile: (id) => {
        actions.setState({
            files: (prev) => {
                delete prev[id];
                return prev;
            }
        });
    },

    clearCtxMenu: () => {
        actions.setState({ ctxMenu: { mode: '', props: null } });
    },

    saveToStorage: () => {
        const state = NewtStore.get();

        return storage.setConfig({
            autohideMenu: state.autohideMenu,
            editMode: state.editMode,
            boxMap: state.boxMap,
            boxStackOrder: state.boxStackOrder,
            options: state.options,
            files: state.files,
            scroll: state.scroll
        })
    },

    moveBoxToTop: (id) => {
        actions.setState({
            boxStackOrder: (prev) => {
                prev = prev.filter(x => x !== id);
                prev.push(id);
                return prev;
            }
        });

        actions.saveToStorage();
    },

    addBox: (x, y) => {
        const box = {
            id: generateId(),
            x: x || 0,
            y: y || 0,
            width: MIN_DIMENSION,
            height: MIN_DIMENSION,
            content: 'Right-Click to Edit...'
        };

        actions.setState({
            boxMap: { [box.id]: box },
            boxes: (prev) => [...prev, box],
            boxStackOrder: (prev) => [...prev, box.id]
        });

        actions.saveToStorage();
    },

    removeBox: (id) => {
        NewtStore.set((prev) => {
            delete prev.boxMap[id];
            prev.boxes = prev.boxes.filter((box) => box.id !== id);
            prev.boxStackOrder = prev.boxStackOrder.filter((x) => x !== id);
            return prev;
        });

        actions.saveToStorage();
    },

    toggleEdit: (boxId) => {
        NewtStore.set((prev) => {
            if (prev.editing[boxId]) delete prev.editing[boxId];
            else prev.editing[boxId] = true;
            return prev;
        });
    },

    updateBox: (id, config) => {
        actions.setState({
            boxMap: (prev) => {
                if (prev[id]) prev[id] = { ...prev[id], ...config };
                return prev;
            }
        });

        actions.saveToStorage();
    },

    resetToDefaults: () => {
        actions.loadFromObject(defaults);
    },

    loadFromObject: (obj) => {
        actions.setState({
            showOptions: false,
            autohideMenu: obj.autohideMenu || false,
            editMode: obj.editMode || false,
            options: obj.options || { ...DEFAULT_OPTIONS },
            scroll: obj.scroll || { x: 0, y: 0 }
        });

        const isNewBoxes = obj.boxMap && Object.keys(obj.boxMap).length > 0;

        if (isNewBoxes) {
            actions.setState({
                boxMap: () => ({}),
                boxes: [],
                boxStackOrder: []
            });
        }

        // apply effects
        const state = NewtStore.get();
        effect.setStyles(state.options.customCss);
        effect.setScrollbarColor(state.options.bgColor);
        effect.setWindowScroll(state.scroll);
        actions.saveToStorage().then(m.redraw);

        setTimeout(() => {
            actions.setState({
                boxMap: (prev) => obj.boxMap || prev,
                boxes: (prev) => isNewBoxes ? Object.values(obj.boxMap) : prev,
                boxStackOrder: (prev) => isNewBoxes ? Object.keys(obj.boxMap) : prev
            });

            actions.saveToStorage().then(m.redraw);
        });
    }
};