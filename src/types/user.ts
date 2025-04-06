import { StateData, TransitionData } from './elems';

export interface SingleTransitionAction {
    action: 'delete' | 'create' | 'edit';
    type: 'transition';
    item: TransitionData;
}

export interface SingleStateAction {
    action: 'delete' | 'create' | 'edit';
    type: 'state';
    item: StateData;
}

export interface MultipleAction {
    action: 'create-multiple' | 'delete-multiple';
    state: StateData;
    transitions: TransitionData[];
}

export type UserAction = SingleTransitionAction | SingleStateAction | MultipleAction;
