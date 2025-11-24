import TodoList from "@/components/TodoList";
import { useEffect, useState } from "react";
import { getTodos, addTodo } from "@/stores/features/todos";
import { useAppDispatch } from "@/Hooks/index";
import { useForm } from "@mantine/form";
import { Button, Group, Select, SelectProps, TextInput } from "@mantine/core";
import { DIFFICULTY_CONFIG } from "@/types/todo";

function LayoutMain() {
  const dispatch = useAppDispatch();
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      difficulty: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "请输入任务名称" : null),
      difficulty: (value) => (value.length < 2 ? "请选择任务难度" : null),
    },
  });

  const submit = (values: any) => {
    dispatch(addTodo(values));
    form.reset();
    // 通过改变 key 强制重新渲染表单
    setFormKey((prev) => prev + 1);
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      {option.label}
      {checked && <span>✅</span>}
    </Group>
  );

  // 从配置生成选项
  const difficultyOptions = Object.entries(DIFFICULTY_CONFIG).map(
    ([key, config]) => ({
      value: key,
      label: `${config.label} +${config.exp} EXP`,
    })
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <form
          className="flex items-center justify-center"
          onSubmit={form.onSubmit((values) => submit(values))}
        >
          <TextInput
            placeholder="输入新任务"
            className="mr-2 w-72"
            {...form.getInputProps("name")}
            withAsterisk
          />
          <Select
            key={formKey}
            placeholder="难度"
            className="w-40 mr-2"
            data={difficultyOptions}
            renderOption={renderSelectOption}
            {...form.getInputProps("difficulty")}
            withAsterisk
          />
          <Button type="submit" className="app-card-ns" color="red">
            添加待办
          </Button>
        </form>
      </div>
      {/* TODO列表 */}
      <TodoList />
    </>
  );
}

export default LayoutMain;