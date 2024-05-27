import { summon_teachers } from "./database_functions";

export function recognizer ( message ) {
    let isATeacher = false;
    teacherList = summon_teachers();
    for (let i = 0; i < teacherList.length; i++) {
        if (teacherList[i].telegram_id == message.from.id) {
          isATeacher = true;
          break;
        }
      }
}