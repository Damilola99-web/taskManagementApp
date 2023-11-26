import { createSlice } from "@reduxjs/toolkit";
import boards from "../../data.json";

const initialState = {
  boards: boards,
  selectedBoard: boards.boards[0],
};

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setId: (state) => {
      state.selectedBoard = state.boards.boards[0];
      // set ids's for boards
      state.boards.boards.map((board) => (board.id = Math.random() * 100000));
      // set ids's for tasks
      state.boards.boards.forEach((board) => {
        board.columns.forEach((column) => {
          column.tasks.map((task) => {
            task.id = Math.random() * 1000000000;
          });
        });
      });

      // set ids's for subtasks
      state.boards.boards.forEach((board) => {
        board.columns.forEach((column) => {
          column.tasks.forEach((task) => {
            task.subtasks.map((subtask) => {
              subtask.id = Math.random() * 100000000;
            });
          });
        });
      });
    },

    selectBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
    addNewTask: (state, action) => {
      state.selectedBoard.columns.forEach((column) => {
        if (action.payload.status === column.name) {
          column.tasks.push(action.payload);
        }
      });
    },
    editBoard: (state, action) => {
      state.boards.boards.forEach((item) => {
        if (item.id === state.selectedBoard.id) {
          item.name = action.payload.name;
          item.columns = action.payload.columns;
        }
      });
    },

    createBoard: (state, action) => {
      state.boards.boards.push(action.payload);
    },
    deleteBoard: (state, action) => {
      state.boards = {
        boards: state.boards.boards.filter(
          (board) => board.id !== action.payload
        ),
      };
      state.selectedBoard = state.boards.boards[0];
    },
    markCompleted: (state, action) => {
      state.selectedBoard.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          task.subtasks.map((subtask) => {
            if (subtask.id === action.payload.id) {
              subtask.isCompleted = !subtask.isCompleted;
            }
          });
        });
      });

      state.boards.boards.forEach((board) => {
        board.columns.forEach((column) => {
          column.tasks.forEach((task) => {
            task.subtasks.map((subtask) => {
              if (subtask.id === action.payload.id) {
                subtask.isCompleted = !subtask.isCompleted;
              }
            });
          });
        });
      });
    },
    changeStatus: (state, action) => {
      const completed = [];

      state.boards.boards.forEach((board) => {
        board.columns.forEach((column) => {
          column.tasks.forEach((task) => {
            if (task.id === action.payload) {
              task.subtasks.map((subtask) => {
                if (subtask.isCompleted) {
                  completed.push(subtask);
                }

                // console.log(completed.length);

                task.status =
                  completed.length === 0
                    ? board.columns[0].name
                    : completed.length > 0 &&
                      completed.length < task.subtasks.length
                    ? board.columns[1].name
                    : completed.length === task.subtasks.length
                    ? board.columns[2].name
                    : "";
              });
            }
          });
        });
      });
    },

    deleteTask: (state, action) => {
      state.boards = {
        boards: state.boards.boards.map((board) => ({
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== action.payload),
          })),
        })),
      };
    },
  },
});

export const {
  selectBoard,
  addNewTask,
  editBoard,
  setId,
  createBoard,
  deleteBoard,
  markCompleted,
  changeStatus,
  deleteTask,
} = kanbanSlice.actions;
export default kanbanSlice.reducer;
