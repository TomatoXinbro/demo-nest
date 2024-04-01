'use server'; /* 'use server' 标记可以从客户端代码调用的服务器端函数。 */
import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    required_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number() // 强制转换为number
    .gt(0, { message: 'Please enter an amount greater than $0.' }), // gt 最小值 lte 最大值
  status: z.enum(['pending', 'paid'], {
    required_error: 'Please select an invoice status.',
  }), // 枚举类型
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  /* State 包含useformData传递的状态 */
  const validatedFields = CreateInvoice.safeParse(
    Object.fromEntries(formData.entries()), // 获取所有formData属性键值对 再转为对象
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.log('error:', error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function editInvoice(
  id: string,
  prevState: State /* State 包含useformData传递的状态 */,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse(
    Object.fromEntries(formData.entries()), // 获取所有formData属性键值对 再转为对象
  );
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // 转换金额
  // convert 转换
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices'); //清楚缓存重新发起请求
  redirect('/dashboard/invoices'); // 重定向
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
  revalidatePath('/dashboard/invoices'); // 不需要重定向，只需清除缓存重新发起请求
}
