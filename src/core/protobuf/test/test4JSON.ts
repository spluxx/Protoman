export const test4UserValueExpected = {
  type: {
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
  },
  singleFields: [
    [
      'course_name',
      {
        type: {
          tag: 'primitive',
          name: 'string',
          defaultValue: '',
        },
        value: 'Math221',
      },
    ],
    [
      'course_number',
      {
        type: {
          tag: 'primitive',
          name: 'int32',
          defaultValue: '0',
        },
        value: '221',
      },
    ],
    [
      'lab',
      {
        type: {
          tag: 'enum',
          name: 'Lab',
          options: ['lab', 'no_lab'],
          optionValues: {
            lab: 0,
            // eslint-disable-next-line @typescript-eslint/camelcase
            no_lab: 1,
          },
        },
        selected: 'no_lab',
      },
    ],
    [
      'isRegistered',
      {
        type: {
          tag: 'primitive',
          name: 'bool',
          defaultValue: 'false',
        },
        value: 'true',
      },
    ],
  ],
  repeatedFields: [
    [
      'students',
      [
        {
          type: {
            tag: 'message',
            name: 'Student',
            singleFields: [
              ['person', 'Person'],
              ['grade', 'Grade'],
            ],
            repeatedFields: [],
            oneOfFields: [],
            mapFields: [],
          },
          singleFields: [
            [
              'person',
              {
                type: {
                  tag: 'message',
                  name: 'Person',
                  singleFields: [
                    ['first_name', 'string'],
                    ['age', 'int32'],
                  ],
                  repeatedFields: [],
                  oneOfFields: [],
                  mapFields: [],
                },
                singleFields: [
                  [
                    'first_name',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'string',
                        defaultValue: '',
                      },
                      value: 'Louis',
                    },
                  ],
                  [
                    'age',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'int32',
                        defaultValue: '0',
                      },
                      value: '23',
                    },
                  ],
                ],
                repeatedFields: [],
                oneOfFields: [],
                mapFields: [],
              },
            ],
            [
              'grade',
              {
                type: {
                  tag: 'enum',
                  name: 'Grade',
                  options: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
                  optionValues: {
                    Freshman: 0,
                    Sophomore: 1,
                    Junior: 2,
                    Senior: 3,
                  },
                },
                selected: 'Junior',
              },
            ],
          ],
          repeatedFields: [],
          oneOfFields: [],
          mapFields: [],
        },
        {
          type: {
            tag: 'message',
            name: 'Student',
            singleFields: [
              ['person', 'Person'],
              ['grade', 'Grade'],
            ],
            repeatedFields: [],
            oneOfFields: [],
            mapFields: [],
          },
          singleFields: [
            [
              'person',
              {
                type: {
                  tag: 'message',
                  name: 'Person',
                  singleFields: [
                    ['first_name', 'string'],
                    ['age', 'int32'],
                  ],
                  repeatedFields: [],
                  oneOfFields: [],
                  mapFields: [],
                },
                singleFields: [
                  [
                    'first_name',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'string',
                        defaultValue: '',
                      },
                      value: 'Inchan',
                    },
                  ],
                  [
                    'age',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'int32',
                        defaultValue: '0',
                      },
                      value: '24',
                    },
                  ],
                ],
                repeatedFields: [],
                oneOfFields: [],
                mapFields: [],
              },
            ],
            [
              'grade',
              {
                type: {
                  tag: 'enum',
                  name: 'Grade',
                  options: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
                  optionValues: {
                    Freshman: 0,
                    Sophomore: 1,
                    Junior: 2,
                    Senior: 3,
                  },
                },
                selected: 'Senior',
              },
            ],
          ],
          repeatedFields: [],
          oneOfFields: [],
          mapFields: [],
        },
      ],
    ],
    [
      'instructors',
      [
        {
          type: {
            tag: 'message',
            name: 'Instructor',
            singleFields: [
              ['person', 'Person'],
              ['title', 'Title'],
            ],
            repeatedFields: [],
            oneOfFields: [],
            mapFields: [],
          },
          singleFields: [
            [
              'person',
              {
                type: {
                  tag: 'message',
                  name: 'Person',
                  singleFields: [
                    ['first_name', 'string'],
                    ['age', 'int32'],
                  ],
                  repeatedFields: [],
                  oneOfFields: [],
                  mapFields: [],
                },
                singleFields: [
                  [
                    'first_name',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'string',
                        defaultValue: '',
                      },
                      value: 'Duvall',
                    },
                  ],
                  [
                    'age',
                    {
                      type: {
                        tag: 'primitive',
                        name: 'int32',
                        defaultValue: '0',
                      },
                      value: '50',
                    },
                  ],
                ],
                repeatedFields: [],
                oneOfFields: [],
                mapFields: [],
              },
            ],
            [
              'title',
              {
                type: {
                  tag: 'enum',
                  name: 'Title',
                  options: ['Lecturer', 'Professor'],
                  optionValues: {
                    Lecturer: 0,
                    Professor: 1,
                  },
                },
                selected: 'Lecturer',
              },
            ],
          ],
          repeatedFields: [],
          oneOfFields: [],
          mapFields: [],
        },
      ],
    ],
  ],
  oneOfFields: [
    [
      'class_hours',
      [
        'time',
        {
          type: {
            tag: 'enum',
            name: 'Time',
            options: ['morning', 'afternoon', 'night', 'online'],
            optionValues: {
              morning: 0,
              afternoon: 1,
              night: 2,
              online: 3,
            },
          },
          selected: 'morning',
        },
      ],
    ],
  ],
  mapFields: [],
};
