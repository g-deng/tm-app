import { StateData, TransitionData } from './elems';

export interface SingleAction {
    action: 'delete' | 'create' | 'edit';
    type: 'state' | 'transition';
    item: StateData | TransitionData;
}

export interface MultipleAction {
    action: 'create-multiple' | 'delete-multiple';
    state: StateData;
    transitions: TransitionData[];
}

export type UserAction = SingleAction | MultipleAction;
