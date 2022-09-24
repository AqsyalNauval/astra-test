import { Button, Form, Input } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswod, setConfirmPassword] = useState("");

  const router = useRouter();

  const validateMessages = {
    types: {
      email: `not a valid email!`,
    },
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const submit = async () => {
    var formData = new FormData();
    var regularExpression =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    var minNumberofChars = 8;

    try {
      if (username.length <= 0 || email.length <= 0 || password.length <= 0) {
        Toast.fire({
          icon: "warning",
          title: "Semua data wajib diisi!",
        });
        return;
      }

      if (password !== confirmPasswod) {
        Toast.fire({
          icon: "warning",
          title: "Password Tidak Sama",
        });
        return;
      }

      if (password.length < minNumberofChars) {
        Toast.fire({
          icon: "warning",
          title: "Password tidak boleh kurang dari 8 kata",
        });
        return;
      }

      if (!regularExpression.test(password)) {
        Toast.fire({
          icon: "warning",
          title:
            "Kata sandi harus minimal 8 karakter dan mengandung setidaknya 1 karakter huruf besar dan 1 karakter khusus",
        });
        return;
      }
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      await API.authRegister(formData);
      router.push("/login");
    } catch (err: any) {
      Toast.fire({
        icon: "error",
        title: err.response.data.error.message,
      });
    }
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div style={{ padding: "20px" }}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={submit}
          validateMessages={validateMessages}
        >
          <Form.Item label="Username">
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>

          <Form.Item
            name={["user", "email"]}
            label="Email"
            rules={[{ type: "email" }]}
          >
            <Input onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item label="Password">
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item label="Confirm Password">
            <Input.Password
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;
