import { Button, Form, Input, Modal, PageHeader, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API from "../api";
import Swal from "sweetalert2";
import Head from "next/head";

type DataDetailType = {
  attributes: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  id: number;
};

const Home = () => {
  const route = useRouter();
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState<DataDetailType>(
    {} as DataDetailType
  );
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [value, setValue] = useState("");
  const [dataSource, setDataSource] = useState("");

  interface DataType {
    key: string;
    number: number;
    address: string;
    tags: string[];
    title: string;
    content: string;
    attributes: any;
    id: number;
    createdAt: string;
    updatedAt: string;
  }

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

  const getData = async (page: any) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
      const res = await API.getArticles(token, page);
      setData(res.data);
      setTotalPage(res.meta.pagination.total);
    } catch (err) {}
  };

  const getDetailData = async (id: number) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
      const res = await API.getDetailArticles(token, id);
      setDataDetail(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const editArticles = async () => {
    var formData = new FormData();
    const token = JSON.parse(localStorage.getItem("accessToken") || "{}");

    try {
      formData.append(
        "data",
        JSON.stringify({ title: title, content: content })
      );
      await API.updateArticles(token, formData, dataDetail.id);
      Toast.fire({
        icon: "success",
        title: "Update Berhasil",
      });
      await getData(1);
      setIsModalEdit(false);
    } catch (err) {}
  };

  const createArticles = async () => {
    var formData = new FormData();
    const token = JSON.parse(localStorage.getItem("accessToken") || "{}");

    try {
      formData.append(
        "data",
        JSON.stringify({ title: title, content: content })
      );
      await API.createArticles(token, formData);
      Toast.fire({
        icon: "success",
        title: "Update Berhasil",
      });
      await getData(1);
      setIsModalCreate(false);
    } catch (err) {}
  };

  const deleteArticle = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken") || "{}");

    try {
      Swal.fire({
        title: "Yakin?",
        text: "Ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await API.deleteArticles(token, dataDetail.id);
          getData(1);
          Swal.fire("Berhasil!", "Data Telah Di Hapus", "success");
        }
      });
    } catch (err) {}
  };

  const showModal = async () => {
    setIsModalDetail(true);
  };

  const handleOk = () => {
    setIsModalDetail(false);
  };

  const handleCancel = () => {
    setIsModalDetail(false);
  };

  const showModalEdit = async () => {
    setIsModalEdit(true);
    setIsModalDetail(false);
  };

  const handleOkEdit = () => {
    setIsModalEdit(false);
  };

  const handleCancelEdit = () => {
    setIsModalEdit(false);
  };

  const showModalCreate = () => {
    setIsModalCreate(true);
  };

  const handleOkCreate = () => {
    setIsModalCreate(false);
  };

  const handleCancelCreate = () => {
    setIsModalCreate(false);
  };

  useEffect(() => {
    if ("accessToken" in localStorage === false) {
      route.push("/login");
    }
    getData(1);
  }, []);

  const filteredData = data.filter(
    (entry: any) =>
      entry.attributes.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
  );
  const FilterByNameInput = (
    <Input
      placeholder="Search Title"
      value={value}
      onChange={(e) => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = data.filter(
          (entry: any) =>
            entry.attributes.title
              .toLowerCase()
              .indexOf(value.toLowerCase()) !== -1
        );
        setData(filteredData);
      }}
    />
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: FilterByNameInput,
      dataIndex: "title",
      key: "title",
      render: (_, { attributes }) => (
        <div onClick={() => showModal()}>{attributes.title}</div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { attributes }) => (
        <div onClick={() => showModal()}>
          {moment(attributes.createdAt).format("DD/MM/YYYY")}
        </div>
      ),
      sorter: (a, b) =>
        moment(a.attributes.createdAt).unix() -
        moment(b.attributes.createdAt).unix(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              showModalEdit();
            }}
          >
            Edit{" "}
          </a>
          <a onClick={() => deleteArticle()}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <PageHeader
        ghost={false}
        title="List Articles"
        extra={[
          <Button onClick={() => showModalCreate()} key="1" type="ghost">
            Create Article
          </Button>,
          <Button
            onClick={() => {
              localStorage.clear(), route.push("/login");
            }}
            key="2"
            type="primary"
          >
            Logout
          </Button>,
        ]}
      >
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                getDetailData(record.id);
              },
            };
          }}
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            total: totalPage,
            onChange: (page: number) => {
              getData(page);
            },
          }}
        />

        <Modal
          title="Detail "
          open={isModalDetail}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <table className="table-detail">
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
            <tr>
              <td>{dataDetail?.attributes?.title}</td>
              <td>{dataDetail?.attributes?.content}</td>
              <td>
                {moment(dataDetail?.attributes?.createdAt).format("DD/MM/YYYY")}
              </td>
              <td>
                {moment(dataDetail?.attributes?.updatedAt).format("DD/MM/YYYY")}
              </td>
            </tr>
          </table>
        </Modal>

        <Modal
          title="Edit"
          open={isModalEdit}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
          footer={null}
        >
          <Form name="nest-messages">
            <Form.Item label="Title">
              <Input onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>

            <Form.Item label="Content">
              <Input onChange={(e) => setContent(e.target.value)} />
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => editArticles()}
                type="primary"
                htmlType="submit"
              >
                Edit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Create"
          open={isModalCreate}
          onOk={handleOkCreate}
          onCancel={handleCancelCreate}
          footer={null}
        >
          <Form name="nest-messages">
            <Form.Item label="Title">
              <Input onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>

            <Form.Item label="Content">
              <Input onChange={(e) => setContent(e.target.value)} />
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => createArticles()}
                type="primary"
                htmlType="submit"
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeader>
    </>
  );
};

export default Home;
