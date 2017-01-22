using System;
using System.Threading.Tasks;

namespace KwizzApi.Utils
{
    public static class AsyncUtils
    {
        private static TR Await<TR>(Task<TR> task)
        {
            task.Wait();
            return task.Result;
        }

        public static Func<T1, TR> Await<T1, TR>(this Func<T1, Task<TR>> func)
        {
            return (p1) => Await(func(p1));
        }

        public static Func<T1, T2, TR> Await<T1, T2, TR>(this Func<T1, T2, Task<TR>> func)
        {
            return (p1, p2) => Await(func(p1, p2));
        }
    }
}