import { Button, Col, Form, Input, Space } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../api";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
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

    try {
      formData.append("identifier", userName);
      formData.append("password", password);
      const res = await API.authLogin(formData);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("accessToken", JSON.stringify(res.jwt));
      Toast.fire({
        icon: "success",
        title: "Login Berhasil",
      });
      router.push("/");
    } catch (err: any) {
      Toast.fire({
        icon: "error",
        title: err.response.data.error.message,
      });
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div style={{ paddingTop: "20px" }}>
        <Form {...layout} name="nest-messages">
          <Form.Item label="Username">
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={() => submit()}
              >
                Login
              </Button>

              <Button
                onClick={() => router.push("/login/register")}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Register
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
