/* eslint-disable @typescript-eslint/camelcase */
import { MessageType, EnumType, ProtoCtx, PrimitiveValue, EnumValue, MessageValue } from '../protobuf';
import { string as stringType, int32 as int32Type, bool as boolType } from '../primitiveTypes';

const labType: EnumType = {
  tag: 'enum',
  name: 'Lab',
  options: ['lab', 'no_lab'],
  optionValues: { lab: 0, no_lab: 1 },
};

const timeType: EnumType = {
  tag: 'enum',
  name: 'Time',
  options: ['morning', 'afternoon', 'night', 'online'],
  optionValues: { morning: 0, afternoon: 1, night: 2, online: 3 },
};

const gradeType: EnumType = {
  tag: 'enum',
  name: 'Grade',
  options: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
  optionValues: { Freshman: 0, Sophomore: 1, Junior: 2, Senior: 3 },
};

const titleType: EnumType = {
  tag: 'enum',
  name: 'Title',
  options: ['Lecturer', 'Professor'],
  optionValues: { Lecturer: 0, Professor: 1 },
};

const personType: MessageType = {
  tag: 'message',
  name: 'Person',
  singleFields: [
    ['first_name', 'string'],
    ['age', 'int32'],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const studentType: MessageType = {
  tag: 'message',
  name: 'Student',
  singleFields: [
    ['person', 'Person'],
    ['grade', 'Grade'],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const instructorType: MessageType = {
  tag: 'message',
  name: 'Instructor',
  singleFields: [
    ['person', 'Person'],
    ['title', 'Title'],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

export const classType: MessageType = {
  tag: 'message',
  name: 'Class',
  singleFields: [
    ['course_name', 'string'],
    ['course_number', 'int32'],
    ['lab', 'Lab'],
    ['isRegistered', 'bool'],
  ],
  repeatedFields: [
    ['students', 'Student'],
    ['instructors', 'Instructor'],
  ],
  oneOfFields: [
    [
      'class_hours',
      [
        ['hours', 'string'],
        ['time', 'Time'],
      ],
    ],
  ],
  mapFields: [],
};

export const sampleCtx2: ProtoCtx = {
  types: {
    string: stringType,
    int32: int32Type,
    bool: boolType,
    Student: studentType,
    Person: personType,
    Instructor: instructorType,
    Time: timeType,
    Lab: labType,
    Grade: gradeType,
    Title: titleType,
    Class: classType,
  },
  origin: {},
};

const courseNameValue: PrimitiveValue = {
  type: stringType,
  value: 'Math221',
};

const courseNumberValue: PrimitiveValue = {
  type: int32Type,
  value: '221',
};

const student1FirstNameValue: PrimitiveValue = {
  type: stringType,
  value: 'Louis',
};

const student1AgeValue: PrimitiveValue = {
  type: int32Type,
  value: '23',
};

const student1GradeValue: EnumValue = {
  type: gradeType,
  selected: 'Junior',
};

const student2FirstNameValue: PrimitiveValue = {
  type: stringType,
  value: 'Inchan',
};

const student2AgeValue: PrimitiveValue = {
  type: int32Type,
  value: '24',
};

const student2GradeValue: EnumValue = {
  type: gradeType,
  selected: 'Senior',
};

const instructor1FirstNameValue: PrimitiveValue = {
  type: stringType,
  value: 'Duvall',
};

const instructor1AgeValue: PrimitiveValue = {
  type: int32Type,
  value: '50',
};

const instructor1TitleValue: EnumValue = {
  type: titleType,
  selected: 'Lecturer',
};

const labValue: EnumValue = {
  type: labType,
  selected: 'no_lab',
};

const hoursValue: PrimitiveValue = {
  type: stringType,
  value: '08:30',
};

const timeValue: EnumValue = {
  type: timeType,
  selected: 'morning',
};

const isRegisteredValue: PrimitiveValue = {
  type: boolType,
  value: 'true',
};

const person1Value: MessageValue = {
  type: personType,
  singleFields: [
    ['first_name', student1FirstNameValue],
    ['age', student1AgeValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const person2Value: MessageValue = {
  type: personType,
  singleFields: [
    ['first_name', student2FirstNameValue],
    ['age', student2AgeValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const person3Value: MessageValue = {
  type: personType,
  singleFields: [
    ['first_name', instructor1FirstNameValue],
    ['age', instructor1AgeValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const student1Value: MessageValue = {
  type: studentType,
  singleFields: [
    ['person', person1Value],
    ['grade', student1GradeValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const student2Value: MessageValue = {
  type: studentType,
  singleFields: [
    ['person', person2Value],
    ['grade', student2GradeValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const instructor1Value: MessageValue = {
  type: instructorType,
  singleFields: [
    ['person', person3Value],
    ['title', instructor1TitleValue],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

export const classValue: MessageValue = {
  type: classType,
  singleFields: [
    ['course_name', courseNameValue],
    ['course_number', courseNumberValue],
    ['isRegistered', isRegisteredValue],
    ['lab', labValue],
  ],
  repeatedFields: [
    ['students', [student1Value, student2Value]],
    ['instructors', [instructor1Value]],
  ],
  oneOfFields: [['class_hours', ['time', timeValue]]],
  mapFields: [],
};

export const test4UserExpectedJson = {
  course_name: 'Math221',
  course_number: 221,
  isRegistered: true,
  lab: 1,
  time: 0,
  students: [
    { person: { first_name: 'Louis', age: 23 }, grade: 2 },
    { person: { first_name: 'Inchan', age: 24 }, grade: 3 },
  ],
  instructors: [{ person: { first_name: 'Duvall', age: 50 }, title: 0 }],
};
