import React, { useState } from "react";
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button';
import { gql, useMutation } from '@apollo/client';

const SignupMutation = gql`
  mutation AddTodo($name:String!, $phone: String!) {
    signup(name: $name, phone: $phone)
  }
`;


function Signup() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [signupFunction, { data, loading, error }] = useMutation(SignupMutation);

  const onSubmit = () => {
    signupFunction({ variables: { phone, name } });
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <div class="flex flex-col items-center my-8 mx-auto w-80 gap-4">
      <Input placeholder="phone" name="phone" onChange={(e) => { setPhone(e.target.value) }} />
      <Input placeholder="name" name="name" onChange={(e) => { setName(e.target.value) }} />
      <Button onClick={onSubmit}>Signup</Button>
    </div>
  )
}

export default Signup;