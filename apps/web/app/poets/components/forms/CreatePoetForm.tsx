"use client";
import { Button, Group, TextInput } from "@mantine/core";
import { DatePickerInput, Day } from "@mantine/dates";
import { useForm } from "@mantine/form";

/*
firstName: string;
lastName: string;
birthDate: string; // a "YYYY-MM-DD" format
email: string;
instagramHandle: string;

*/
export function CreatePoetForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      instagramHandle: "",
      birthDay: 1,
      birthYear: 1990,
      birthMonth: 1,
    },
    validate: {
      firstName: (value) =>
        value.length > 3 ? null : "First Name must be at least 3 char long",
      lastName: (value) =>
        value.length > 3 ? null : "Last Name must be at least 3 char long",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Email"),
    },
  });
  return (
    <>
      <h3>Create Poet Form</h3>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Group justify="center" w="100%">
          <TextInput
            w="30%"
            withAsterisk
            label="First Name"
            placeholder="First Name"
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
          />
          <TextInput
            withAsterisk
            w="50%"
            label="Last Name"
            placeholder="Last Name"
            key={form.key("lastName")}
            {...form.getInputProps("lastName")}
          />
        </Group>
        <Group justify="center" w="100%">
          <DatePickerInput
            w="80%"
            withAsterisk
            dropdownType="modal"
            valueFormat="YYYY MM DD"
            label="Birth Date"
            placeholder="Pick Date"
            value={
              new Date(
                form.values.birthYear,
                form.values.birthMonth - 1,
                form.values.birthDay
              )
            }
            key={form.key("birthDay")}
            onChange={(value) => {
              form.setValues({
                birthDay: value?.getDate(),
                birthMonth: (value?.getMonth() ?? 0) + 1,
                birthYear: value?.getFullYear() ?? 1990,
              });
            }}
          />

          <TextInput
            w="80%"
            withAsterisk
            withErrorStyles
            label="Email"
            placeholder="Email"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
        </Group>
        <Group justify="center" w="100%">
          <TextInput
            w="80%"
            withErrorStyles
            label="Instagram Handle"
            placeholder="@myInstagramHandle"
            key={form.key("instagramHandle")}
            {...form.getInputProps("instagramHandle")}
          />
        </Group>
        <Group justify="center" pt="md">
          <Button w="80%" type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </>
  );
}
