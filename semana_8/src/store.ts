import {create} from 'zustand';
import {persist,createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export type Driver={id:string;name:string;unit:string};
type State={drivers:Driver[];add:(name:string)=>void};
export const useDrivers=create<State>()(persist((set)=>({
 drivers:[{id:'d1',name:'Carlos Mendoza',unit:'Móvil 01'},{id:'d2',name:'Ana Rodríguez',unit:'Móvil 02'}],
 add:(name)=>set(s=>({drivers:[{id:String(Date.now()),name,unit:'Móvil '+String(s.drivers.length+1).padStart(2,'0')},...s.drivers]}))
}),{name:'taxi-drivers-week07',storage:createJSONStorage(()=>AsyncStorage)}));
