import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Elk } from './ScriptEngine';

@ccclass('NewComponent')
export class NewComponent extends Component {
    start() {
        Elk
    }

    update(deltaTime: number) {
        
    }
}


