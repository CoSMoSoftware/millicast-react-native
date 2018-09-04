export const rejectionForwarder = reject => fn =>
  async (...args) => {
    try {
      fn(...args)
    } catch (err) {
      reject(err)
    }
  }
