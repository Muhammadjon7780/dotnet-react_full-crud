
import "./create.scss";
import { SetStateAction, useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Space } from 'antd';
import { useMutation } from "@tanstack/react-query";
import { api, IUser } from "../home";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import { MaskedInput } from "antd-mask-input";

interface ICreateEmploye{
  className:string;
  refetch: () => void;
  clickId?:number | null;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>;
  open:boolean;
  initialValue?:IUser | null;
  setInitialValue:React.Dispatch<SetStateAction<IUser | null>>
}


const CreateEmploye = ({className="", refetch, setOpen, open, setInitialValue, initialValue}:ICreateEmploye) => {

  const [form] = Form.useForm();

  const {mutate:createMutate, isPending:postPending, isError:postIsError, error:postError} = useMutation({
    mutationFn:(data:IUser) => axios.post(`${api}/Employees`, data).then((res) => res.data),
    onSuccess:() => {
      refetch();
    }
  })
  const {mutate:updateMutate, isError:putIsError, isPending:putPending, error:putError} = useMutation({
    mutationFn:(data:IUser) => axios.put(`${api}/Employees/${initialValue?.id}`, data).then((res) => res.data),
    onSuccess:() => {
      refetch();
      
    }
  })

  const isError = postIsError || putIsError;
  const isPending = postPending || putPending;
  const error = postError || putError;

  useEffect(() => {
    if (open) {
      if (initialValue) {
        form.setFieldsValue(initialValue);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValue, form]);


  const showDrawer = () => {
    setInitialValue(null)
    form.resetFields();
    setOpen(true);
  };
  
  
  const onFinish = (values: any) => {
    
    if (initialValue) {
      updateMutate({
        ...values,
        name:values.name.trim(),
        email:values.email.trim(),
        phone:values.phone.trim(),
      })
    }else{
      createMutate({
        ...values,
        name:values.name.trim(),
        email:values.email.trim(),
        phone:values.phone.trim(),
      })

    }

  };

  const onClose = () => {
    setOpen(false);
  };


  
  if (isPending) return <h2>Loading...</h2>;
  if (isError) return <div>{error?.message}</div>;
  




return(
  <div className={`modal ${className}`}>
    <Button size="middle" className="add-btn" type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Create User
      </Button>

      <Drawer
      size="default"
      placement="right"
        title="Create a new account"
        width={600}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" onClick={() => {
              form.submit();
               onClose();
               }}  type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form  form={form}  onFinish={onFinish} layout="vertical" >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                 name={ 'name'} 
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={ 'email'}
                label="Email"
                rules={[{ required: true, message: 'Please enter email' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="Please enter email"
                />
              </Form.Item>
            </Col>
          </Row>
         
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={ 'phone'}
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: 'please enter number',
                  },
                ]}
              >
                <MaskedInput mask={ '+998(00)000-00-00'} width={800} placeholder="please enter number" />
              </Form.Item>
            </Col> 
           </Row>
        </Form>
      </Drawer>
  </div>
)
}
export default CreateEmploye;
